# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A TypeScript Playwright test framework targeting the **EasyRPA** application. It combines UI (Page Object Model), API, and BDD (Cucumber) testing in one project.

## Commands

```bash
# Setup
npm install
npx playwright install
cp .env.example .env        # then fill in values (see Environment below)

# Run a single test file (always pass a --project)
npx playwright test tests/easyrpa/ui/login.test.ts --project=easyrpa-chrome

# Run by title
npx playwright test --project=easyrpa-chrome -g "should create AP via input form"

# Suites
npm run test:easyrpa              # full UI suite (Chrome)
npm run test:easyrpa:crud         # Automation Process CRUD suite
npm run test:easyrpa:api          # API tests (easyrpa-api project)
npm run test:easyrpa:bdd          # Cucumber/Gherkin scenarios
npm run test:easyrpa:crossbrowser # Chrome + Firefox + Edge + WebKit
npm run test:easyrpa:smoke        # @smoke-tagged UI tests, headless
npm run test:easyrpa:api:smoke    # @smoke-tagged API tests, headless
npm run test:easyrpa:mobile:smoke # @smoke-tagged UI tests on Android + iOS emulators

# Debug
npx playwright test --project=easyrpa-chrome --headed
npx playwright test --project=easyrpa-chrome --debug
npx playwright test --ui

# Quality (also enforced by Husky: pre-commit = lint+format, pre-push = smoke)
npm run code:check                # eslint
npm run code:format               # prettier --write

# Reports
npm run report:playwright | report:allure | report:cucumber
npm run clean:reports
```

`HEADLESS=true` forces headless (always on in CI). Smoke is filtered by the `@smoke` tag.

## Architecture

The framework is layered, and **fixtures are the wiring** that compose the layers together.

**Fixture composition is the key concept.** `easyrpa.fixture.ts` extends `api.fixture.ts`, so UI tests receive *both* Page Objects and API clients in the same test:

- `api.fixture.ts` provides `apiContext`, `authToken` (fetched once via `AuthClient` client-credentials flow), the API clients (`apClient`, `usersClient`, `dsClient`), and context bags `apContext` (`createUniqueAPData()`, carries `createdAPId`/`createdRunId`) and `dsContext` (`createUniqueDataStoreData()`, carries `createdDataStoreId`).
- `easyrpa.fixture.ts` adds `homePage` (logs in as `DEFAULT_USER = adminUserDEV`), `apPage` (navigates to the Automation Processes module), `runsPage`, and `dataStorePage`. Requesting `homePage`/`apPage`/`dataStorePage` triggers login + navigation automatically.

**API-driven test data is the dominant pattern.** UI tests create/delete data through API clients for speed and isolation: `apClient.create(...)` in `beforeEach`, assert via the UI, then `apClient.deleteById(apContext.createdAPId)` in `afterEach`. See `tests/easyrpa/ui/ap.crud.test.ts` for the canonical example. Some flows require UI creation (e.g. file upload for Data Stores in `ds.crud.test.ts`) — in those cases creation happens via the page object and deletion still goes through the API client in `afterEach`.

**Layers:**
- `src/apps/easyrpa/pages/` — Page Objects extend `BasePage` (shared spinner waiting, header assertions, generic input/button helpers). Pages compose components.
- `src/apps/easyrpa/components/` — reusable UI widgets (`Table`, `TableRow`, `Dialog`, `SidePanel`, `Message`, `NavigationMenu`, `SearchField`, `TabContainer`, ...) extend `BaseComponent` (constructed from a root `Locator`).
- `src/api/clients/` — typed clients extend `BaseApiClient` (which holds the bearer token and logs every request/response). `AuthClient` is separate (no token yet).
- `src/api/models/` & `src/api/routes/endpoints.ts` — request/response types and endpoint URLs.
- `src/factories/` — `createUniqueAPData()` and `createUniqueDataStoreData()` generate unique, isolated test data.
- `tests/easyrpa/test-data/users.ts` — user registry; passwords are lazy getters reading env vars, so credentials are only required when a user is actually used.
- `tests/easyrpa/test-data/files/` — JSON fixtures used for file-upload flows (e.g. `test-data-store.json`, `test-ds-records.json`, `test-automation-process.json`).

**BDD is a separate runtime.** Cucumber (`cucumber.config.cjs`) does *not* use Playwright fixtures. `tests/easyrpa/bdd/support/hooks.ts` manually launches the browser per scenario and `CustomWorld` holds the shared `page`/`context`. Steps live in `tests/easyrpa/bdd/steps/`. Run via `tsx`, not the Playwright runner.

## Path aliases

Imports use TS path aliases (see `tsconfig.json`), e.g. `@easyrpa/pages`, `@easyrpa/components`, `@api/clients`, `@fixtures/*`, `@config/env`, `@factories/*`, `@easyrpa/test-data/*`, `@easyrpa/support/*`. Prefer these over relative paths.

## Environment & gotchas

- Secrets load from `.env` via `dotenv`. `getEnv(name)` (`src/config/env.ts`) **throws if a variable is missing** — misconfiguration fails fast.
- **Switching DEV/UAT is not a single switch.** `playwright.config.ts` reads `EASYRPA_DEV_URL` (UAT line is commented out), but `api.fixture.ts`, `AuthClient`, and the `adminUserDEV` test user are also hardcoded to the `EASYRPA_DEV_*` variables. Changing environment means updating all of these, not just the config.
- Each Playwright project sets `testDir` to either `tests/easyrpa/ui` (browser projects) or `tests/easyrpa/api` (`easyrpa-api`). A UI test won't run under `easyrpa-api` and vice versa — match the file's directory to the `--project`.
- `easyrpa-chrome` runs with `workers: 1`; other projects run fully parallel.
