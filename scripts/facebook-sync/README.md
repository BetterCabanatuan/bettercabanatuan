# Facebook sync

A background service for macOS. Every 4 hours it scrapes the Facebook pages in
`pages.json`, merges the posts into `data/facebook/`, regenerates
`src/data/news.facebook.json`, and pushes to `main`, which deploys the site.

```sh
bash scripts/facebook-sync/install.sh     # install, or update after changing install.sh
bash scripts/facebook-sync/uninstall.sh   # stop it and remove the deploy key
```

Needs `git`, `gh` (logged in with admin on the repo), `node`/`npm`, and
[uv](https://docs.astral.sh/uv/). `install.sh` adds a write deploy key to the
repo, clones it into `~/Library/Application Support/bettercabanatuan-sync/`,
loads a launchd agent, and runs the first sync. Commits use your global git
name and email.

## A run

1. Reset the service's clone to `origin/main` (`npm ci` when the lockfile changed).
2. `sync.py` re-reads the current and previous month of each page and merges
   by post id into `data/facebook/<handle>/<YYYY>/<YYYY-MM>.json`.
3. Nothing changed: stop. Otherwise `npm run import:posts` regenerates
   `src/data/news.facebook.json`.
4. If the news feed changed, `npm test` and `npm run build` must pass. If they
   fail, only `data/` is pushed and the feed waits for a fix.
5. Commit and push to `main`. If `main` moved meanwhile, rebase once and retry.

A commit that touches only `data/` does not deploy (`ignoreCommand` in
`vercel.json`) or run CI (`paths-ignore`).

Runs at 00:00, 04:00, 08:00, 12:00, 16:00, and 20:00 local time, each delayed
up to 10 minutes; launchd runs a missed slot when the Mac wakes. A desktop
notification says when new posts reach the site, and when 3 runs in a row fail.

| In the service folder | What |
| --- | --- |
| `run.sh` | One run; `bash run.sh` syncs now |
| `repo/` | The clone the service commits from |
| `logs/sync-<YYYY-MM>.log` | One block per run |
| `logs/scrape-errors.jsonl` | Failed requests and rate limits |
| `deploy_key` | The repo's write deploy key |

## The archive

| File | What |
| --- | --- |
| `data/facebook/<handle>/<YYYY>/<YYYY-MM>.json` | Posts of one Manila month, newest first |
| `data/facebook/<handle>/page.json` | Latest page info |
| `data/facebook/<handle>/sync.json` | How far back the archive is complete |

A post missing from two complete refreshes in a row gets `deleted_at`, and the
importer leaves it off the site; it comes back if Facebook shows it again.
Counts and Facebook's signed image links change on every fetch, so they alone
do not rewrite a file. Facebook also mints a new `pfbid` permalink per fetch;
the first one saved is kept, so site links stay put.

To add a page, add `{ "handle", "name", "start": "YYYY-MM" }` to `pages.json`
and merge. The next runs walk back to `start`, resuming from the oldest saved
post if a rate limit stops them.

Run a sync by hand without the service (no commit or push):

```sh
uv run scripts/facebook-sync/sync.py
npm run import:posts -- data/facebook/lgucabanatuan
```
