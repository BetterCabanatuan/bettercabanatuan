#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "facebook-pages-scraper @ git+https://github.com/joshuagemvicente/facebook-pages-scraper@adde9ab08dd175c056fa55b7eee7fb25c408cb2d",
# ]
# ///
"""
Refreshes a raw Facebook archive (data/facebook/ unless --data says
otherwise) for every page in pages.json. install.sh runs it every 4 hours.

    uv run sync.py [--data DIR] [--page HANDLE] [--error-log FILE] [--summary FILE]
    uv run sync.py [--data DIR] --seed HANDLE POSTS.json --backfilled-through YYYY-MM

Each page keeps:

    <data>/<handle>/<YYYY>/<YYYY-MM>.json  posts of one Manila month, newest first
    <data>/<handle>/page.json              latest page info
    <data>/<handle>/sync.json              {"backfilled_through": "YYYY-MM"}

A run re-reads the current and previous month (further back when the newest
saved post is older, so downtime leaves no gap) and merges by post id. Older
months stay as they are. A saved post that a complete refresh did not return
gets `missing_runs`; after two complete refreshes in a row it gets
`deleted_at`, and the importer hides it. A post that comes back loses both.

Until sync.json says the archive reaches the page's start month, the run also
walks back from the oldest saved post with `until`, so a backfill stopped by a
rate limit resumes where it left off.

A month file is rewritten only when something other than the reaction,
comment, and share counts or Facebook's signed image links changed. Those
change on every fetch and would otherwise make a commit every run.

Exits 1 when a page failed or stopped early. The posts it did get are still
saved, and the next run picks up the rest.
"""

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from facebook_page_scraper import page_post_info
from facebook_page_scraper.page_info import PageInfo
from facebook_page_scraper.page_post_info import PagePostInfo

MANILA = timezone(timedelta(hours=8))
DATA = Path(__file__).resolve().parents[2] / "data" / "facebook"
PAGES_FILE = Path(__file__).with_name("pages.json")

# Facebook rate-limited feed requests 1–2 s apart on 2026-10-17; 5 s apart passed.
page_post_info.PAGE_DELAY = 5
# Complete refreshes in a row that must miss a saved post before it is marked deleted.
MISSES_BEFORE_DELETED = 2
# A refresh that misses more than this share of the saved posts it covers is
# treated as a bad response, not as mass deletion.
MAX_MISSING_SHARE = 0.5
# How far a refresh reaches back past the newest saved post.
OVERLAP_SECONDS = 24 * 60 * 60

# Change on every fetch; ignored when deciding whether a file changed.
POST_COUNTS = {"reaction_count", "comment_count", "share_count"}
PAGE_COUNTS = {
    "page_followers",
    "page_likes",
    "page_likes_count",
    "page_talking_count",
    "page_were_here_count",
    "page_business_hours",
    "page_rating",
}
# Bookkeeping this script adds to a post, apart from what the scraper returns.
TRACKING = {"missing_runs", "deleted_at"}


def stable(value, ignore=POST_COUNTS):
    """value without counts and signed fbcdn links, for change detection."""
    if isinstance(value, dict):
        return {k: stable(v, ignore) for k, v in value.items() if k not in ignore}
    if isinstance(value, list):
        return [stable(v, ignore) for v in value]
    if isinstance(value, str) and "fbcdn.net" in value:
        return None
    return value


def post_key(post: dict):
    return post.get("id") or post.get("url")


def manila_month(unix: int) -> str:
    return datetime.fromtimestamp(unix, MANILA).strftime("%Y-%m")


def month_start(month: str) -> int:
    """Unix time of the first moment of a YYYY-MM month in Manila."""
    year, mon = map(int, month.split("-"))
    return int(datetime(year, mon, 1, tzinfo=MANILA).timestamp())


def previous_month_start(now: datetime) -> int:
    first = now.astimezone(MANILA).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return int((first - timedelta(days=1)).replace(day=1).timestamp())


def read_json(path: Path, default):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def write_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


class Archive:
    """One page's saved posts, read from and written back to its month files."""

    def __init__(self, handle: str):
        self.dir = DATA / handle
        self.posts: dict = {}
        self.saved: dict = {}
        for path in sorted(self.dir.glob("[0-9][0-9][0-9][0-9]/[0-9][0-9][0-9][0-9]-[0-9][0-9].json")):
            month = read_json(path, [])
            self.saved[path.stem] = stable(month)
            for post in month:
                self.posts[post_key(post)] = post
        self.state = read_json(self.dir / "sync.json", {})
        self.saved_state = dict(self.state)

    def times(self) -> list[int]:
        return [p["creation_time"] for p in self.posts.values() if not p.get("deleted_at")]

    def merge(self, scraped: list, since: int | None = None) -> dict:
        """
        Add new posts and refresh saved ones. With since, the scrape was complete
        from since on, so saved posts from then that it did not return count a miss.
        """
        stats = {"new": 0, "edited": 0, "missing": 0, "deleted": 0, "restored": 0}
        seen = set()
        for post in scraped:
            key = post_key(post)
            if key is None or not isinstance(post.get("creation_time"), int):
                continue
            seen.add(key)
            old = self.posts.get(key)
            if old is None:
                stats["new"] += 1
            else:
                # Facebook mints a new pfbid permalink on every fetch; the first one keeps working.
                post = dict(post, url=old.get("url") or post.get("url"))
                # Same media under fresh signed links: keep the saved ones so diffs show real changes.
                if stable(old.get("medias")) == stable(post.get("medias")):
                    post["medias"] = old.get("medias")
                if stable(old, POST_COUNTS | TRACKING) != stable(post):
                    stats["edited"] += 1
                if old.get("deleted_at"):
                    stats["restored"] += 1
            self.posts[key] = dict(post)
        if since is not None:
            self._count_misses(seen, since, stats)
        return stats

    def _count_misses(self, seen: set, since: int, stats: dict):
        covered = [
            post for key, post in self.posts.items()
            if post["creation_time"] >= since and not post.get("deleted_at")
        ]
        missing = [post for post in covered if post_key(post) not in seen]
        if missing and len(missing) > max(2, len(covered) * MAX_MISSING_SHARE):
            print(
                f"  Refresh missed {len(missing)} of {len(covered)} saved posts. "
                "Not counting misses: that looks like a bad response, not deletions."
            )
            return
        now = datetime.now(timezone.utc).isoformat(timespec="seconds")
        for post in missing:
            runs = post.get("missing_runs", 0) + 1
            if runs >= MISSES_BEFORE_DELETED:
                post.pop("missing_runs", None)
                post["deleted_at"] = now
                stats["deleted"] += 1
            else:
                post["missing_runs"] = runs
                stats["missing"] += 1

    def save(self) -> list[str]:
        """Write the months whose content changed. Returns their YYYY-MM names."""
        months: dict = {}
        for post in self.posts.values():
            months.setdefault(manila_month(post["creation_time"]), []).append(post)
        changed = []
        for month, posts in sorted(months.items()):
            posts.sort(key=lambda p: (p["creation_time"], str(post_key(p))), reverse=True)
            if self.saved.get(month) != stable(posts):
                write_json(self.dir / month[:4] / f"{month}.json", posts)
                self.saved[month] = stable(posts)
                changed.append(month)
        if self.state != self.saved_state:
            write_json(self.dir / "sync.json", self.state)
            self.saved_state = dict(self.state)
        return changed

    def save_page_info(self, info: dict) -> bool:
        path = self.dir / "page.json"
        if stable(read_json(path, None), PAGE_COUNTS) == stable(info, PAGE_COUNTS):
            return False
        write_json(path, info)
        return True


def backfilled(archive: Archive, start: str) -> bool:
    reached = archive.state.get("backfilled_through")
    return reached is not None and reached <= start


def sync_page(page: dict, error_log: str | None) -> tuple[bool, str]:
    handle, start = page["handle"], page["start"]
    archive = Archive(handle)
    ok = True
    print(f"[{handle}] {len(archive.posts)} saved posts")

    since = previous_month_start(datetime.now(MANILA))
    if archive.times():
        since = min(since, max(archive.times()) - OVERLAP_SECONDS)
    since = max(since, month_start(start))
    print(f"[{handle}] Refreshing posts since {datetime.fromtimestamp(since, MANILA):%Y-%m-%d %H:%M} Manila")
    refresh = PagePostInfo(handle, max_posts=None, since=since, error_log=error_log)
    posts = refresh.scrape()
    if posts is None or not refresh.complete:
        ok = False
        print(f"[{handle}] Refresh failed or stopped early; keeping what it got, not counting misses")
    stats = archive.merge(posts or [], since if ok else None)

    if not backfilled(archive, start):
        oldest = min(archive.times(), default=None)
        print(f"[{handle}] Backfilling to {start}, from {oldest or 'the newest post'}")
        backfill = PagePostInfo(
            handle, max_posts=None, since=month_start(start), until=oldest, error_log=error_log
        )
        older = backfill.scrape()
        for key, value in archive.merge(older or []).items():
            stats[key] += value
        if older is not None and backfill.complete:
            archive.state["backfilled_through"] = start
        else:
            ok = False
            print(f"[{handle}] Backfill stopped early; the next run resumes from the oldest saved post")

    info = PageInfo.PageInfo(handle, error_log=error_log)
    if info is None:
        print(f"[{handle}] Page info failed; page.json left as it was")
    elif archive.save_page_info(info):
        print(f"[{handle}] page.json updated")

    months = archive.save()
    parts = [f"{stats[k]} {k}" for k in ("new", "edited", "missing", "deleted", "restored") if stats[k]]
    summary = f"{handle}: {', '.join(parts) or 'no post changes'}"
    if months:
        summary += f" ({', '.join(months)})"
    if not ok:
        summary += " [incomplete]"
    print(summary)
    return ok, summary


def seed(handle: str, posts_file: str, backfilled_through: str):
    archive = Archive(handle)
    stats = archive.merge(read_json(Path(posts_file), []))
    archive.state["backfilled_through"] = backfilled_through
    months = archive.save()
    print(f"[{handle}] Seeded {stats['new']} new posts into {len(months)} month files")


def main():
    global DATA
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--data", help=f"Archive folder (default {DATA})")
    parser.add_argument("--page", help="Only this handle from pages.json")
    parser.add_argument("--error-log", help="JSON Lines file for failed requests and rate limits")
    parser.add_argument("--summary", help="Write a one-line-per-page summary here")
    parser.add_argument("--seed", nargs=2, metavar=("HANDLE", "POSTS_JSON"), help="Import a scraper output file")
    parser.add_argument("--backfilled-through", metavar="YYYY-MM", help="With --seed: the file reaches this month")
    args = parser.parse_args()
    if args.data:
        DATA = Path(args.data).expanduser()

    if args.seed:
        if not args.backfilled_through:
            parser.error("--seed needs --backfilled-through")
        seed(*args.seed, args.backfilled_through)
        return

    pages = read_json(PAGES_FILE, [])
    if args.page:
        pages = [p for p in pages if p["handle"] == args.page]
        if not pages:
            parser.error(f"{args.page} is not in {PAGES_FILE.name}")

    results = []
    for page in pages:
        try:
            results.append(sync_page(page, args.error_log))
        except Exception as exc:
            print(f"[{page['handle']}] Sync crashed: {exc!r}")
            results.append((False, f"{page['handle']}: crashed ({type(exc).__name__})"))
    if args.summary:
        Path(args.summary).write_text("\n".join(s for _, s in results) + "\n", encoding="utf-8")
    sys.exit(0 if all(ok for ok, _ in results) else 1)


if __name__ == "__main__":
    main()
