---
description: Fix a Bug card (oldest in Bug list, or the given shortLink) — usage /fix-bug [shortLink]
argument-hint: [shortLink]
---

Fix a bug card. Target: `$ARGUMENTS` if given, otherwise the oldest card from `./scripts/trello.sh cards "Bug"`.
If the Bug list is empty, say so and stop.

1. `./scripts/trello.sh get <shortLink>`; read the description and comments for reproduction steps.
   If there is no way to reproduce, comment asking for details on the card and stop.
2. Move the card to `In Progress`; create `fix/<shortLink>-<slug>`.
3. Reproduce the bug with a failing test first, find the root cause, then fix it with the smallest change.
   If the fix needs a DB change, stop at the DB gate from `/ship` step 2.
4. From here follow `/ship` steps 6-12 (diagram if schema changed, local checks, Playwright and screenshots
   for UI bugs, commit with `[trello:<shortLink>]`, PR, CI loop capped at 3, no merge).
