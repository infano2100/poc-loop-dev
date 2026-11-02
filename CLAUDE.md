# Project: AI Dev Loop POC

This repo is a proof-of-concept for an AI-driven delivery loop:
**Trello (board) → Claude Code (dev) → GitHub (repo + Actions CI) → Trello (status)**.

## Stack
- Frontend: React 19 + TypeScript + Vite
- Package manager: npm
- CI: GitHub Actions (`.github/workflows/ci.yml`)
- Board: Trello, accessed ONLY through `./scripts/trello.sh`
- Design: PNG exports in `docs/design/` (Figma frames exported manually)
- Tests: vitest + Testing Library (unit), Playwright (UI, Chromium)

## Source of truth
- Requirements: `docs/requirements.md`
- Spec (written by /plan): `docs/spec.md`
- Design: `docs/design/*.png` — match layout, spacing, copy and states shown there.
  If a screen state is missing from the design, choose the simplest reasonable UI and
  note it in the PR description under "Design gaps".

## Trello board lists (status flow)
`Backlog → Todo → In Progress → In Review → Done`
Side lists: `Bug` (human opens bug cards here), `Blocked` (Claude parks work it cannot finish).

Labels: `feature`, `task`, `bug`, `ci-fix`, `needs-decision`.

Card identity = Trello **shortLink** (8 chars, from the card URL `trello.com/c/<shortLink>/...`).

## Branch / commit / PR conventions
- Branch: `feat/<shortLink>-<slug>` for features/tasks, `fix/<shortLink>-<slug>` for bugs.
  The shortLink in the branch name is how CI finds the card — never omit it.
- Commits: Conventional Commits, and end the subject with `[trello:<shortLink>]`.
  Example: `feat(auth): add login form validation [trello:aB3dE9xY]`
- One card = one branch = one PR. Never mix cards in a PR.
- PR body must contain: card link, what changed, how it was tested, design gaps (if any).

## Hard rules
- NEVER push to `main` or force-push. Always open a PR; a human merges.
- NEVER edit `.github/workflows/*` to make a failing check pass (no skipping tests,
  no `continue-on-error`, no deleting tests). Fix the code instead.
- NEVER read or print `.env` contents or tokens.
- Run local checks before every push: `npm run lint && npm run typecheck && npm run test:coverage && npm run build`
  (plus `npm run e2e` when the card changes UI).
- Every file under `src/` with logic needs a co-located `*.test.ts(x)` (exempt: `main.tsx`, type-only
  files, fixtures, config, re-export-only `index.ts`). Coverage is enforced per file at 80%.
- UI cards: after implementing, write Playwright specs, run them, and attach the screenshots to the
  Trello card with `./scripts/trello.sh attach` plus a comment saying what each shows, before `In Review`.
- New workflows (`unit-tests.yml`, the `e2e` job) are written only when the user asks; the user reviews
  and merges them.
- CI fix attempts are capped at **3 per card**. After the 3rd failure: stop, move the card
  to `Blocked`, comment the failing step + your diagnosis, and report to the user.

## Database changes (decision task)
Touching the DB means adding or changing tables, columns, indexes, relations, migrations, or
switching DB or ORM. Before any such change:
1. Stop. Do not write schema, migration or ORM code yet.
2. Comment the options on the card (pros, cons, recommendation).
3. Move the card to `Blocked` and add the label `needs-decision`.
4. Wait for the user's answer in chat, then continue.

Every schema change also regenerates the ER diagram with the `diagram-design` skill at
`docs/db/er-diagram.html` (+ `.svg`, `.png` via `export-diagram`). Commit it in the same PR and
mention it in the PR body.

## Phases
`docs/requirements.md` marks one phase as current. `/plan` plans only that phase.

## When to stop and ask the user
- Requirement or design contradicts itself, or a decision is hard to reverse
  (DB schema, auth approach, new paid service, deleting files outside the card's scope).
- A CI failure looks environmental (secrets missing, runner outage, flaky network)
  rather than caused by the code.
- The card is too big for one PR (> ~400 changed lines expected) — propose a split instead.

## Trello helper reference
```
./scripts/trello.sh lists                         # list names + ids
./scripts/trello.sh cards "<List name>"           # cards in a list
./scripts/trello.sh get <shortLink>               # card detail + comments
./scripts/trello.sh create "<List>" "<title>" "<desc>" [label]
./scripts/trello.sh move <shortLink> "<List>"
./scripts/trello.sh comment <shortLink> "<text>"
./scripts/trello.sh label <shortLink> <label>
./scripts/trello.sh attach <shortLink> <file>     # attach an image/file to the card
```
