---
description: Ship one Trello card end to end (branch, code, tests, PR, CI, fixes) — usage /ship <shortLink>
argument-hint: <shortLink>
---

Ship Trello card `$ARGUMENTS`. Follow CLAUDE.md for conventions and hard rules.

1. `./scripts/trello.sh get $ARGUMENTS`; read the card, the comments, `docs/spec.md` and the relevant `docs/design/*.png`.
   If the card is too big for one PR or unclear, stop and ask me.
2. **DB gate.** If the card adds or changes tables, columns, indexes, relations, migrations, DB or ORM:
   stop before writing any of it. Comment the options (pros, cons, recommendation) on the card,
   move it to `Blocked`, add the label `needs-decision`, tell me, and wait for my answer.
3. `./scripts/trello.sh move $ARGUMENTS "In Progress"`.
4. Create `feat/$ARGUMENTS-<slug>` from an up-to-date `main` (for `bug` cards use `fix/`).
5. Implement test-first. Every file with logic gets a co-located `*.test.ts(x)`. Match the design;
   record anything missing under "Design gaps".
6. If the schema changed: regenerate the ER diagram with the `diagram-design` skill at
   `docs/db/er-diagram.html` and export `.svg` and `.png` (`diagram-design:export-diagram`).
7. Run `npm run lint && npm run typecheck && npm run test:coverage && npm run build`. Fix until green.
8. **UI cards:** write Playwright specs (one per page: main flow and key states), run `npm run e2e`,
   then attach the screenshots from `e2e-screenshots/` (1440 px and 768 px; normal, error, loading, empty)
   with `./scripts/trello.sh attach $ARGUMENTS <file>` and add a comment saying what each shows.
   Skip this step for cards with no UI.
9. Commit with Conventional Commits ending in `[trello:$ARGUMENTS]`, push the branch, and open a PR with
   `gh pr create` (card link, what changed, how tested, design gaps, ER diagram updated if relevant).
10. Watch CI with `gh pr checks --watch`. On failure read the logs, fix the code (never touch workflows or
    skip tests), push, and repeat. Maximum 3 fix attempts.
11. When CI is green: comment the PR link on the card and make sure it sits in `In Review` (trello-sync does this on PR open).
    After the 3rd failure: move the card to `Blocked`, comment the failing step and diagnosis, and tell me.
12. Never merge. Report the PR URL, CI fix count and any design gaps.
