#!/bin/bash
# Removes the Facebook sync from this Mac: the launchd job, the deploy key on
# GitHub, and the service folder (clone, key, logs). The archive in
# data/facebook/ stays on main.
#
#   bash scripts/facebook-sync/uninstall.sh
set -uo pipefail

REPO_SLUG=BetterCabanatuan/bettercabanatuan
LABEL=org.bettercabanatuan.facebook-sync
SERVICE_HOME="$HOME/Library/Application Support/bettercabanatuan-sync"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null && echo "Stopped $LABEL"
rm -f "$PLIST"

if [ -f "$SERVICE_HOME/deploy_key.pub" ]; then
  key=$(cut -d' ' -f2 "$SERVICE_HOME/deploy_key.pub")
  id=$(gh repo deploy-key list --repo "$REPO_SLUG" --json id,key --jq ".[] | select(.key | contains(\"$key\")) | .id")
  if [ -n "$id" ] && gh repo deploy-key delete "$id" --repo "$REPO_SLUG"; then
    echo "Removed the deploy key from $REPO_SLUG"
  else
    echo "Could not remove the deploy key; delete it under $REPO_SLUG Settings > Deploy keys"
  fi
fi

rm -rf "$SERVICE_HOME"
echo "Removed $SERVICE_HOME"
