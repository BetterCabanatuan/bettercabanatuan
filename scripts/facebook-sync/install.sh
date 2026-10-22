#!/bin/bash
# Installs the Facebook sync on this Mac: a launchd agent that, every 4 hours,
# scrapes the pages in pages.json, merges the posts into data/facebook/,
# regenerates src/data/news.facebook.json, and pushes to main. See README.md.
#
#   bash scripts/facebook-sync/install.sh
#
# Safe to re-run: it keeps the deploy key, clone, and logs, rewrites run.sh,
# and reloads the job. uninstall.sh removes it.
set -euo pipefail

REPO_SLUG=BetterCabanatuan/bettercabanatuan
LABEL=org.bettercabanatuan.facebook-sync
SERVICE_HOME="$HOME/Library/Application Support/bettercabanatuan-sync"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
KEY="$SERVICE_HOME/deploy_key"

[ "$(uname)" = Darwin ] || { echo "This installer is for macOS (launchd)."; exit 1; }
for cmd in git uv node npm gh; do
  command -v "$cmd" >/dev/null || { echo "Missing $cmd. Install it and re-run."; exit 1; }
done
if [[ "$(readlink /etc/localtime)" != */Asia/Manila ]]; then
  echo "Note: this Mac's time zone is not Asia/Manila; the 4-hourly runs follow local time."
fi
author_name=$(git config --global user.name || true)
author_email=$(git config --global user.email || true)
[ -n "$author_name" ] && [ -n "$author_email" ] || {
  echo "Set git config --global user.name and user.email first; sync commits use them."
  exit 1
}

mkdir -p "$SERVICE_HOME/logs" "$(dirname "$PLIST")"

# A key that can push to this one repo, so the job does not need your SSH agent.
if [ ! -f "$KEY" ]; then
  host=$(scutil --get LocalHostName)
  ssh-keygen -q -t ed25519 -N "" -C "facebook-sync@$host" -f "$KEY"
  gh repo deploy-key add "$KEY.pub" --repo "$REPO_SLUG" --allow-write --title "Facebook sync ($host)"
  echo "Added a write deploy key to $REPO_SLUG"
fi

ssh_command="ssh -i '$KEY' -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
if [ ! -d "$SERVICE_HOME/repo/.git" ]; then
  echo "Cloning $REPO_SLUG..."
  GIT_SSH_COMMAND="$ssh_command" git clone --quiet "git@github.com:$REPO_SLUG.git" "$SERVICE_HOME/repo"
fi
git -C "$SERVICE_HOME/repo" config core.sshCommand "$ssh_command"
# Your name on the commits: Vercel can refuse to deploy commits by unknown authors.
git -C "$SERVICE_HOME/repo" config user.name "$author_name"
git -C "$SERVICE_HOME/repo" config user.email "$author_email"
git -C "$SERVICE_HOME/repo" fetch --quiet origin main
if ! git -C "$SERVICE_HOME/repo" cat-file -e origin/main:scripts/facebook-sync/sync.py 2>/dev/null; then
  echo "origin/main has no scripts/facebook-sync/sync.py yet. Merge the facebook-sync PR, then re-run."
  exit 1
fi

# run.sh lives outside the clone: each run hard-resets the clone, and bash
# reads a running script as it goes.
cat >"$SERVICE_HOME/run.sh" <<'EOF'
#!/bin/bash
# One sync: scrape -> data/facebook/ -> src/data/news.facebook.json -> test and
# build -> commit -> push to main. launchd starts it with --scheduled; run it
# by hand to sync now.
set -uo pipefail
SERVICE_HOME="$(cd "$(dirname "$0")" && pwd)"
REPO="$SERVICE_HOME/repo"
LOGS="$SERVICE_HOME/logs"
SUMMARY="$SERVICE_HOME/summary.txt"
# Consecutive failed runs before a desktop notification.
ALERT_AFTER=3

mkdir -p "$LOGS"
exec >>"$LOGS/sync-$(date +%Y-%m).log" 2>&1

# Spread scheduled runs over 10 minutes so requests do not land on the hour.
if [ "${1:-}" = "--scheduled" ]; then
  sleep $((RANDOM % 600))
fi

# A lock older than two hours is left over from a crash or a power cut.
find "$SERVICE_HOME" -maxdepth 1 -name lock -mmin +120 -exec rmdir {} \; 2>/dev/null
if ! mkdir "$SERVICE_HOME/lock" 2>/dev/null; then
  echo "$(date '+%F %T') Another sync is running; skipped"
  exit 0
fi
trap 'rmdir "$SERVICE_HOME/lock"; rm -f "$SUMMARY"' EXIT

notify() {
  osascript -e "display notification \"$1\" with title \"BetterCabanatuan Facebook sync\"" || true
}

# Pushes once, and once more on top of a main that moved during the run.
# A conflict means someone regenerated the same files; the next run redoes it.
push() {
  git push --quiet origin HEAD:main && return 0
  if git pull --quiet --rebase origin main && git push --quiet origin HEAD:main; then
    return 0
  fi
  git rebase --abort 2>/dev/null
  echo "Push failed; the next run will redo this sync"
  return 1
}

sync() {
  cd "$REPO" || return 1
  git fetch --quiet origin main && git reset --quiet --hard origin/main && git clean --quiet -fd || return 1
  local lock_sum
  lock_sum=$(shasum package-lock.json | cut -d' ' -f1)
  if [ ! -d node_modules ] || [ "$lock_sum" != "$(cat "$SERVICE_HOME/npm-lock.sha" 2>/dev/null)" ]; then
    HUSKY=0 npm ci --no-audit --no-fund --loglevel=error || return 1
    echo "$lock_sum" >"$SERVICE_HOME/npm-lock.sha"
  fi

  local status=0
  uv run --quiet scripts/facebook-sync/sync.py \
    --error-log "$LOGS/scrape-errors.jsonl" --summary "$SUMMARY" || status=1
  if [ -z "$(git status --porcelain -- data)" ]; then
    echo "Archive unchanged; nothing to push"
    return $status
  fi

  local archives
  archives=$(node -p "require('./scripts/facebook-sync/pages.json').map(p => 'data/facebook/' + p.handle).join(' ')")
  # shellcheck disable=SC2086 # one argument per archive
  if ! npm run --silent import:posts -- $archives; then
    echo "Import failed; pushing the raw archive only"
    git checkout -- src/data/news.facebook.json
    status=1
  fi

  git add -- data
  local message="chore(data): sync Facebook posts"
  if ! git diff --quiet -- src/data/news.facebook.json; then
    if npm test --silent && npm run build --silent; then
      git add -- src/data/news.facebook.json
      message="chore(news): sync Facebook posts"
    else
      echo "Tests or build failed; pushing the raw archive only"
      git checkout -- src/data/news.facebook.json
      status=1
    fi
  fi

  git commit --quiet --no-verify -m "$message" -m "$(cat "$SUMMARY")" || return 1
  push || return 1
  echo "Pushed $(git rev-parse --short HEAD): $message"
  local new
  new=$(grep -Eo '[0-9]+ new' "$SUMMARY" | awk '{n += $1} END {print n + 0}')
  if [ "$new" -gt 0 ] && [ "$message" = "chore(news): sync Facebook posts" ]; then
    notify "$new new post(s) pushed to the site"
  fi
  return $status
}

echo "=== $(date '+%F %T %Z') ==="
if sync; then
  echo 0 >"$SERVICE_HOME/failures"
  echo "=== done ==="
  exit 0
fi

failures=$(($(cat "$SERVICE_HOME/failures" 2>/dev/null || echo 0) + 1))
echo "$failures" >"$SERVICE_HOME/failures"
echo "=== failed or stopped early ($failures in a row); the next run picks up the rest ==="
if [ "$failures" -ge "$ALERT_AFTER" ]; then
  notify "$failures runs in a row failed. Logs: $LOGS"
fi
exit 1
EOF

# launchd starts jobs with a bare PATH; give it the one node and uv came from.
path="$(dirname "$(command -v node)"):$(dirname "$(command -v uv)"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
hours=""
for hour in 0 4 8 12 16 20; do
  hours+="    <dict><key>Hour</key><integer>$hour</integer><key>Minute</key><integer>0</integer></dict>
"
done
cat >"$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$SERVICE_HOME/run.sh</string>
    <string>--scheduled</string>
  </array>
  <key>StartCalendarInterval</key>
  <array>
$hours  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>$path</string>
  </dict>
  <key>StandardOutPath</key>
  <string>$SERVICE_HOME/logs/launchd.log</string>
  <key>StandardErrorPath</key>
  <string>$SERVICE_HOME/logs/launchd.log</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "Installed $LABEL: runs at 00:00, 04:00, 08:00, 12:00, 16:00, and 20:00, plus up to 10 minutes."

echo "Running the first sync now (installs npm packages, so it takes a few minutes)..."
log="$SERVICE_HOME/logs/sync-$(date +%Y-%m).log"
start=$(wc -l <"$log" 2>/dev/null || echo 0)
if bash "$SERVICE_HOME/run.sh"; then result=succeeded; else result=failed; fi
tail -n +"$((start + 1))" "$log"
echo
echo "First sync $result."
echo "Logs:     $SERVICE_HOME/logs"
echo "Sync now: bash \"$SERVICE_HOME/run.sh\""
