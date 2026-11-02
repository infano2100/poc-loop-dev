#!/usr/bin/env bash
# Trello helper for Claude Code. Requires: curl, jq.
# Env (from .env or shell): TRELLO_KEY, TRELLO_TOKEN, TRELLO_BOARD_ID
set -euo pipefail

if [[ -f "$(dirname "$0")/../.env" ]]; then
  set -a; source "$(dirname "$0")/../.env"; set +a
fi
: "${TRELLO_KEY:?TRELLO_KEY not set}"
: "${TRELLO_TOKEN:?TRELLO_TOKEN not set}"
: "${TRELLO_BOARD_ID:?TRELLO_BOARD_ID not set}"

API="https://api.trello.com/1"
AUTH="Authorization: OAuth oauth_consumer_key=\"$TRELLO_KEY\", oauth_token=\"$TRELLO_TOKEN\""

req() { # method path [curl args...]
  local method="$1" path="$2"; shift 2
  curl -sSf -X "$method" -H "$AUTH" -H "Accept: application/json" -G "$API$path" "$@"
}

list_id() { # list name -> id
  local id
  id=$(req GET "/boards/$TRELLO_BOARD_ID/lists" | jq -r --arg n "$1" '.[] | select(.name==$n) | .id')
  [[ -n "$id" ]] || { echo "List not found: $1" >&2; exit 1; }
  echo "$id"
}

label_id() { # label name -> id
  local id
  id=$(req GET "/boards/$TRELLO_BOARD_ID/labels" | jq -r --arg n "$1" '.[] | select(.name==$n) | .id' | head -1)
  [[ -n "$id" ]] || { echo "Label not found: $1" >&2; exit 1; }
  echo "$id"
}

cmd="${1:-help}"; shift || true
case "$cmd" in
  lists)
    req GET "/boards/$TRELLO_BOARD_ID/lists" | jq -r '.[] | "\(.name)\t\(.id)"' ;;
  cards)
    req GET "/lists/$(list_id "$1")/cards" \
      | jq -r '.[] | "\(.shortLink)\t\(.name)\t[\([.labels[].name]|join(","))]"' ;;
  get)
    req GET "/cards/$1" --data-urlencode "fields=name,desc,shortUrl,idList" \
      --data-urlencode "actions=commentCard" --data-urlencode "labels=true" \
      | jq '{name, shortUrl, desc, labels:[.labels[].name],
             comments:[.actions[] | {date, by:.memberCreator.fullName, text:.data.text}]}' ;;
  create)
    list="$1"; name="$2"; desc="${3:-}"; label="${4:-}"
    args=(--data-urlencode "idList=$(list_id "$list")" --data-urlencode "name=$name" --data-urlencode "desc=$desc")
    [[ -n "$label" ]] && args+=(--data-urlencode "idLabels=$(label_id "$label")")
    req POST "/cards" "${args[@]}" | jq -r '"\(.shortLink)\t\(.shortUrl)"' ;;
  move)
    req PUT "/cards/$1" --data-urlencode "idList=$(list_id "$2")" | jq -r '"moved \(.shortLink)"' ;;
  comment)
    req POST "/cards/$1/actions/comments" --data-urlencode "text=$2" >/dev/null && echo "commented $1" ;;
  label)
    req POST "/cards/$1/idLabels" --data-urlencode "value=$(label_id "$2")" >/dev/null && echo "labeled $1 $2" ;;
  attach)
    [[ -f "$2" ]] || { echo "File not found: $2" >&2; exit 1; }
    curl -sSf -X POST -H "$AUTH" -H "Accept: application/json" \
      -F "file=@$2" -F "name=$(basename "$2")" "$API/cards/$1/attachments" | jq -r '"attached \(.name)"' ;;
  *)
    echo "usage: trello.sh lists|cards <list>|get <id>|create <list> <title> [desc] [label]|move <id> <list>|comment <id> <text>|label <id> <label>|attach <id> <file>"; exit 1 ;;
esac
