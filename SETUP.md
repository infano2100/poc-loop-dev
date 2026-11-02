# AI Dev Loop POC — Setup

## 1. Accounts (all free tiers)
- **GitHub**: new repo (public = unlimited Actions minutes). Install `gh` and run `gh auth login`.
- **Trello**: create a board with lists exactly:
  `Backlog`, `Todo`, `In Progress`, `In Review`, `Done`, `Bug`, `Blocked`
  and labels: `feature`, `task`, `bug`, `ci-fix`.
- **Trello API**: create a Power-Up at https://trello.com/power-ups/admin → API key → generate token.
- **Figma**: export the frames you want built as PNG into `docs/design/` (e.g. `login.png`, `dashboard.png`).

## 2. Repo bootstrap
```bash
npm create vite@latest . -- --template react-ts
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
# copy this POC kit into the repo root (CLAUDE.md, .claude/, .github/, scripts/, .env.example)
chmod +x scripts/trello.sh
cp .env.example .env   # fill in TRELLO_KEY / TRELLO_TOKEN / TRELLO_BOARD_ID
echo ".env" >> .gitignore
```
Make sure `package.json` has these scripts:
```json
"lint": "eslint .",
"typecheck": "tsc -b --noEmit",
"test": "vitest",
"build": "vite build"
```
Smoke test the helper: `./scripts/trello.sh lists`

## 3. GitHub settings
- Settings → Secrets → Actions: add `TRELLO_KEY`, `TRELLO_TOKEN`, `TRELLO_BOARD_ID` (for `trello-sync.yml`).
- Settings → Branches → protect `main`: require PR + require status check `checks`.

## 4. Run the loop
```text
docs/requirements.md   ← write your requirements
docs/design/*.png      ← export from Figma

claude
> /plan                 # spec + card breakdown → you approve → cards created in Todo
> /ship aB3dE9xY        # one card: branch → code → PR → CI → fix (≤3) → In Review
  (you review + merge on GitHub → trello-sync moves card to Done)

# Found a bug while testing? Create a card in the "Bug" list, then:
> /fix-bug              # takes the oldest Bug card (or /fix-bug <shortLink>)
```

## 5. What to measure in the POC
- Cards shipped with 0 CI fixes vs needing fixes; how many hit `Blocked`
- Time from `/ship` to "In Review"
- Review comments per PR (quality signal)
- Design gaps reported vs real misses

## Phase 2 (later, optional)
Trigger `/fix-bug` automatically: Trello webhook → GitHub `repository_dispatch` →
workflow running Claude Code headless (needs an Anthropic API key in Secrets, billed per use).
