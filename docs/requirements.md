# CatToon — Requirements

Upload a photo of a cat and have AI generate a cartoon version of it.
"CatToon" is a placeholder name; keep it in a single constant so it can be renamed in one place.

**Current phase: 1** — `/plan` plans only the phase marked current.

## Roadmap

| Phase | Scope | Detail |
|---|---|---|
| 1 (current) | Login + Dashboard UI, mock data and mock auth | below |
| 2 | Real register + login (email/password, logout, session) | outline |
| 3+ | Google/Facebook login, Forgot Password, email verification, cat photo upload, AI cartoon generation | not yet specified |

## Phase 1 — Login and Dashboard (frontend only)

### Design source
`docs/design/Login_Page.png`, `Dashboard_Page.png`, `Design system@2x.png`.
The mockups are a "Tenant Management System" template. Keep layout, spacing, colors, fonts
and icons; replace the content as listed below.

- Font: Poppins (36/32/24/20 medium, 16 regular and light).
- Primary color `#45A9EA`; text greys `#1A1A1A #333333 #4D4D4D #686868 #999999 #B3B3B3 #CCCCCC #E6E6E6`; white `#FFFFFF`.
- Icons: edit, delete, user, property, maintenance, eye-off (map to equivalents where the meaning changes).

### Stack
Follow the `react-base` skill (Ant Design 5, TanStack Query, Zustand, React Hook Form + Zod,
React Router) and `react-project-structure`. Theme Ant Design with the tokens above.

### Login page
- Layout as in the design: logo/name, welcome text, Email, Password with show/hide toggle,
  Remember me, Forgot Password, Log In, Google and Facebook buttons, Register Now.
- Copy: "Welcome to" / "CatToon" in place of "Tenant Management System".
- Working: email + password form with validation (valid email format, password not empty),
  error message for wrong credentials, loading state while submitting, password show/hide toggle.
- Mock auth: one demo user `demo@cattoon.dev` / `password123` (test values, not real).
  Remember me ticked stores the session in localStorage, otherwise sessionStorage.
- Visible but disabled with a "Coming soon" hint: Forgot Password, Google, Facebook, Register Now.

### Dashboard page
- Opening it without a session redirects to the login page. Logout returns to login.
- Sidebar: Dashboard (active), Gallery, Upload, My Cartoons, Settings. Everything except
  Dashboard is "Coming soon". Hamburger collapses the sidebar.
- Header: language label "English" (display only), user name and ID.
- Four summary cards: Total Cats, Cartoons Generated, In Progress, Failed.
- "Recent Uploads" table (date, photo name, status Done / Processing / Failed) with a "See Gallery" button.
- "Generation Status" box (Job #001 In Progress, Completed, Pending).
- All data comes from fixtures through a data layer that Phase 2+ can replace.

### Responsive
Desktop first, usable from 768 px up. Phone layout is out of scope (record as a design gap).

### Auth service
A single interface (login, logout, current session) used by the UI, with the mock as the first
implementation, so Phase 2 can swap in the real one without touching the pages.

### Definition of done (per phase)
- Both pages match the designs, including states the design lacks (error, loading, empty), which are listed as design gaps in the PR.
- All checks pass: lint, typecheck, unit tests with coverage, build, Playwright.
- Unit tests cover validation, route guard and the auth service.

## Phase 2 — Register and login (outline)
Email/password registration, login, logout, session. Not included: Google/Facebook login,
Forgot Password, email verification.
The first card is a **decision task**: choose DB, auth provider and schema (see "Database changes").

## Cross-cutting rules

### Unit tests
- Every file under `src/` with logic (component, hook, service, util, store) has a co-located `*.test.ts(x)`.
- Exempt: `main.tsx`, type-only files, fixtures, config, `index.ts` that only re-export.
- Enforced by vitest coverage with `perFile` thresholds of 80% (lines, branches, functions, statements).
- A GitHub pipeline (`unit-tests.yml`) runs the tests with coverage on every PR and is a required check on `main`.

### UI verification (Playwright)
- After a card that changes UI is implemented, write Playwright specs (one per page: main flow and key states).
- Screenshots go to `e2e-screenshots/` (git-ignored) at 1440 px and 768 px: normal, error, loading and empty states.
- Attach the screenshots to the Trello card (`./scripts/trello.sh attach`) with a comment explaining each one,
  before moving the card to `In Review`. Cards with no UI skip this.
- A separate `e2e` pipeline job runs Chromium and keeps the screenshots as an artifact.

### Database changes (decision task)
Applies to every phase. Touching the DB means: adding or changing tables, columns, indexes,
relations, migrations, or switching DB or ORM.
1. Stop before making the change.
2. Comment the options on the card with pros, cons and a recommendation.
3. Move the card to `Blocked` with the label `needs-decision`.
4. Wait for the user's answer, then continue.

### Database diagram
Every time the schema changes, regenerate the ER diagram with the `diagram-design` skill
at `docs/db/er-diagram.html` (plus `.svg` and `.png` via `export-diagram`), commit it in the
same PR, and mention it in the PR description.
