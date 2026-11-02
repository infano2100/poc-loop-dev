#!/usr/bin/env bash
# Interactive wizard for the steps only a human can do (accounts, tokens, repo settings).
# Safe to re-run: it asks before every step and skips what is already done.
set -euo pipefail
cd "$(dirname "$0")/.."

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
ask()  { local a; read -r -p "$1 [y/N] " a; [[ "$a" =~ ^[Yy]$ ]]; }
need() { command -v "$1" >/dev/null || { echo "Missing: $1 ($2)"; exit 1; }; }

need gh  "brew install gh"
need jq  "brew install jq"
need curl "install curl"

say "Step 1/5  Trello API key + token"
echo "1) Open https://trello.com/power-ups/admin → New → fill any name/workspace → API key tab → copy the API key."
open "https://trello.com/power-ups/admin" 2>/dev/null || true
read -r -p "Paste TRELLO_KEY: " TRELLO_KEY
echo "2) Open the authorize page, click Allow, copy the token shown."
open "https://trello.com/1/authorize?expiration=30days&scope=read,write&response_type=token&name=ai-dev-loop&key=$TRELLO_KEY" 2>/dev/null || \
  echo "https://trello.com/1/authorize?expiration=30days&scope=read,write&response_type=token&name=ai-dev-loop&key=$TRELLO_KEY"
read -r -s -p "Paste TRELLO_TOKEN (hidden): " TRELLO_TOKEN; echo

tr_api() { # method path [curl args]
  local m="$1" p="$2"; shift 2
  curl -sSf -X "$m" -G "https://api.trello.com/1$p" \
    --data-urlencode "key=$TRELLO_KEY" --data-urlencode "token=$TRELLO_TOKEN" "$@"
}
tr_api GET /members/me --data-urlencode fields=username | jq -r '"Authenticated as \(.username)"'

say "Step 2/5  Trello board (7 lists + 4 labels)"
if ask "Create a new board 'AI Dev Loop POC' now? (no = paste an existing board id)"; then
  BOARD_ID=$(tr_api POST /boards --data-urlencode "name=AI Dev Loop POC" --data-urlencode defaultLists=false | jq -r .id)
  for l in Backlog Todo "In Progress" "In Review" Done Bug Blocked; do
    tr_api POST /lists --data-urlencode "name=$l" --data-urlencode "idBoard=$BOARD_ID" --data-urlencode pos=bottom >/dev/null
    echo "  list: $l"
  done
  for pair in feature:green task:blue bug:red ci-fix:orange; do
    tr_api POST /labels --data-urlencode "name=${pair%%:*}" --data-urlencode "color=${pair##*:}" --data-urlencode "idBoard=$BOARD_ID" >/dev/null
    echo "  label: ${pair%%:*}"
  done
else
  read -r -p "Existing TRELLO_BOARD_ID: " BOARD_ID
  echo "Make sure it has lists: Backlog, Todo, In Progress, In Review, Done, Bug, Blocked and labels: feature, task, bug, ci-fix."
fi

say "Step 3/5  Write .env (git-ignored)"
umask 077
printf 'TRELLO_KEY=%s\nTRELLO_TOKEN=%s\nTRELLO_BOARD_ID=%s\n' "$TRELLO_KEY" "$TRELLO_TOKEN" "$BOARD_ID" > .env
echo "Wrote .env. Testing helper:"
./scripts/trello.sh lists

say "Step 4/5  GitHub repo"
if git remote get-url origin >/dev/null 2>&1; then
  echo "origin already set: $(git remote get-url origin)"
elif ask "Create a GitHub repo from this folder now?"; then
  read -r -p "Repo name [poc-loop-dev]: " NAME; NAME=${NAME:-poc-loop-dev}
  read -r -p "Visibility public|private [public]: " VIS; VIS=${VIS:-public}
  git add -A && git commit -q -m "chore: bootstrap AI dev loop POC" || true
  gh repo create "$NAME" "--$VIS" --source=. --remote=origin --push
fi

say "Step 5/5  GitHub secrets + branch protection"
if ask "Upload TRELLO_KEY / TRELLO_TOKEN / TRELLO_BOARD_ID as Actions secrets?"; then
  gh secret set TRELLO_KEY      --body "$TRELLO_KEY"
  gh secret set TRELLO_TOKEN    --body "$TRELLO_TOKEN"
  gh secret set TRELLO_BOARD_ID --body "$BOARD_ID"
fi
echo "Branch protection needs CI to have run once so the 'checks' status exists."
if ask "Protect main now (require PR + status check 'checks')?"; then
  REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
  gh api -X PUT "repos/$REPO/branches/main/protection" --input - <<JSON
{"required_status_checks":{"strict":false,"contexts":["checks"]},
 "enforce_admins":false,
 "required_pull_request_reviews":{"required_approving_review_count":0},
 "restrictions":null}
JSON
  echo "main protected on $REPO"
fi
say "Done. Next: write docs/requirements.md, export Figma PNGs to docs/design/, then run claude → /plan"
