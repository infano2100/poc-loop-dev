---
description: Ship one Trello card end to end (branch, code, PR, CI, fixes) — usage /ship <shortLink>
argument-hint: <shortLink>
---

Ship Trello card `$ARGUMENTS`. Follow CLAUDE.md for conventions and hard rules.

1. `./scripts/trello.sh get $ARGUMENTS`; read the card, the comments, `docs/spec.md` and the relevant `docs/design/*.png`.
   If the card is too big for one PR or unclear, stop and ask me.
2. `./scripts/trello.sh move $ARGUMENTS "In Progress"`.
3. Create `feat/$ARGUMENTS-<slug>` from an up-to-date `main` (for `bug` cards use `fix/`).
4. Implement test-first. Match the design; record anything missing under "Design gaps".
5. Run `npm run lint && npm run typecheck && npm test -- --run && npm run build`. Fix until green.
6. Commit with Conventional Commits ending in `[trello:$ARGUMENTS]`, push the branch, and open a PR with
   `gh pr create` (card link, what changed, how tested, design gaps).
7. Watch CI with `gh pr checks --watch`. On failure read the logs, fix the code (never touch workflows or
   skip tests), push, and repeat. Maximum 3 fix attempts.
8. When CI is green: comment the PR link on the card and make sure it sits in `In Review` (trello-sync does this on PR open).
   After the 3rd failure: move the card to `Blocked`, comment the failing step and diagnosis, and tell me.
9. Never merge. Report the PR URL, CI fix count and any design gaps.
