---
description: Turn the current phase of docs/requirements.md + docs/design into docs/spec.md and Trello cards in Todo
---

Plan the work. Do not write application code in this command.

1. Read `docs/requirements.md` and every image in `docs/design/`. Plan **only the phase marked current**.
   If anything is missing or contradicts itself, stop and ask me.
2. Write `docs/spec.md`: goals, screens and states from the design, data and component
   structure, test plan, and open questions.
3. Break the spec into cards. Each card is one PR (under ~400 changed lines), independently
   mergeable, with acceptance criteria in the description. Label each `feature` or `task`.
   - A card that touches the DB (see "Database changes" in CLAUDE.md) must start with a decision
     step and be labelled `needs-decision`.
   - A card that changes UI must say in its description that Playwright specs and screenshots are required.
4. Show me the spec summary and the card list (title, label, acceptance criteria). **Wait for my approval.**
5. After approval, create each card with `./scripts/trello.sh create "Todo" "<title>" "<desc>" <label>`
   and report the shortLinks.
