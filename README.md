# Playwright Automation Test Framework

![Playwright](https://img.shields.io/badge/Playwright-1.58-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-5FA04E?logo=nodedotjs&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-12-23D96C?logo=cucumber&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-3-FF5C5C?logo=qameta&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=black)
![Platforms](https://img.shields.io/badge/Platforms-Chromium%20%7C%20Firefox%20%7C%20WebKit%20%7C%20Android%20%7C%20iOS-8A2BE2)

A TypeScript-based end-to-end test automation framework built on [Playwright](https://playwright.dev/), targeting the **EasyRPA** application. It combines UI, API, and BDD testing in a single, well-structured project with rich reporting and cross-browser/mobile coverage.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [License](#license)

## Features

- **Page Object Model (POM)** — pages and reusable UI components (`Table`, `Dialog`, `NavigationMenu`, `SearchField`, etc.) keep tests readable and maintainable.
- **Layered architecture** — clear separation between UI pages, reusable components, API clients, models, factories, and fixtures.
- **Custom Playwright fixtures** — authenticated sessions, pre-navigated pages, and ready-to-use API clients are injected into tests, removing boilerplate setup.
- **API testing layer** — typed API clients (`AuthClient`, `AutomationProcessClient`, `UsersClient`) for direct backend calls, used both for API tests and for fast test data setup/teardown in UI tests.
- **BDD support** — Gherkin feature files run via Cucumber for behavior-driven scenarios.
- **Cross-browser & mobile coverage** — Chrome, Edge, Firefox, WebKit, plus Android (Pixel 5) and iOS (iPhone 15) emulation.
- **Test data factories** — generate unique test data on demand to keep tests isolated and repeatable.
- **TypeScript path aliases** — clean imports such as `@easyrpa/pages`, `@api/clients`, `@fixtures/*`.
- **Rich reporting** — Playwright HTML reports, Allure reports, and Cucumber HTML reports.
- **Quality gates** — ESLint, Prettier, and Husky Git hooks (lint/format on commit, smoke tests on push).

## Tech Stack

| Area | Tools |
| --- | --- |
| Test runner | `@playwright/test` |
| Language | TypeScript, Node.js |
| BDD | `@cucumber/cucumber`, `tsx` |
| Reporting | `allure-playwright`, `allure-cucumberjs`, `multiple-cucumber-html-reporter` |
| Linting & formatting | ESLint, `typescript-eslint`, Prettier |
| Tooling | Husky, `cross-env`, `rimraf`, `dotenv` |

See [docs/stack.md](docs/stack.md) for the full breakdown of each dependency.

## Prerequisites

- **Node.js** 20+ (developed on v24)
- **npm** (bundled with Node.js)
- Access credentials for the EasyRPA environment under test

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Create your environment file from the template (see below)
cp .env.example .env   # then fill in the values

# 4. Verify the setup with a smoke run
npm run test:easyrpa:smoke
```

Husky Git hooks are installed automatically via the `prepare` script.

## Environment Configuration

Secrets and environment URLs are loaded from a `.env` file in the project root (ignored by Git). Copy the provided [.env.example](.env.example) to `.env` and fill in the values:

```dotenv
# Application URLs
EASYRPA_DEV_URL=
EASYRPA_UAT_URL=

# DEV credentials
EASYRPA_DEV_ADMIN_PASSWORD=
EASYRPA_DEV_ADMIN_API_CLIENT_ID=
EASYRPA_DEV_ADMIN_API_CLIENT_SECRET=

# UAT credentials
EASYRPA_UAT_ADMIN_PASSWORD=
EASYRPA_UAT_ADMIN_API_CLIENT_ID=
EASYRPA_UAT_ADMIN_API_CLIENT_SECRET=

# API
EASYRPA_API_SCOPE=
```

The framework reads variables through a small helper (`src/config/env.ts`) that throws a descriptive error if a required variable is missing, so misconfiguration fails fast.

> By default the Playwright config targets `EASYRPA_DEV_URL`. To switch to UAT, update the active URL in [playwright.config.ts](playwright.config.ts).

## Running Tests

All test scripts are defined in [package.json](package.json).

### UI tests

```bash
# Full EasyRPA UI suite (Chrome)
npm run test:easyrpa

# Only the Automation Process CRUD suite
npm run test:easyrpa:crud

# Cross-browser (Chrome, Firefox, Edge, WebKit)
npm run test:easyrpa:crossbrowser
```

### API tests

```bash
npm run test:easyrpa:api
```

### BDD (Cucumber) tests

```bash
npm run test:easyrpa:bdd
```

### Smoke tests

Smoke suites run headless and are filtered by the `@smoke` tag (also wired into the pre-push hook):

```bash
npm run test:easyrpa:smoke         # UI smoke (Chrome)
npm run test:easyrpa:api:smoke     # API smoke
npm run test:easyrpa:mobile:smoke  # Android + iOS smoke
```

### Useful Playwright flags

```bash
# Run a single file
npx playwright test tests/easyrpa/ui/login.test.ts --project=easyrpa-chrome

# Headed / debug / UI mode
npx playwright test --project=easyrpa-chrome --headed
npx playwright test --project=easyrpa-chrome --debug
npx playwright test --ui
```

> Headless mode is controlled by the `HEADLESS` env var (`HEADLESS=true`) and is always on in CI.

## Reporting

```bash
# Playwright HTML report
npm run report:playwright

# Allure report
npm run report:allure

# Cucumber HTML report
npm run report:cucumber

# Clean all reports
npm run clean:reports
```

Traces, screenshots (on failure), and videos (on failure) are captured automatically and attached to reports. All output is written to the `reports/` directory.

## Project Structure

```
playwright-atf-final/
├── src/
│   ├── api/
│   │   ├── clients/            # Typed API clients (Auth, AutomationProcess, Users)
│   │   ├── models/             # Request/response type definitions
│   │   └── routes/             # API endpoint definitions
│   ├── apps/
│   │   └── easyrpa/
│   │       ├── components/     # Reusable UI components (Table, Dialog, Menu, ...)
│   │       └── pages/          # Page Objects (Login, Home, AutomationProcesses, ...)
│   ├── config/                 # Environment helper
│   ├── factories/              # Test data factories
│   └── fixtures/               # Custom Playwright fixtures (UI + API)
├── tests/
│   └── easyrpa/
│       ├── ui/                 # UI test specs
│       ├── api/                # API test specs
│       ├── bdd/                # Cucumber features, steps, and support
│       └── test-data/          # Users and test data files
├── docs/                       # Project documentation
├── reports/                    # Generated test reports (git-ignored)
├── playwright.config.ts        # Playwright projects & global config
├── cucumber.config.cjs         # Cucumber configuration
├── eslint.config.ts            # ESLint configuration
├── prettier.config.js          # Prettier configuration
└── tsconfig.json               # TypeScript config & path aliases
```

### Architecture overview

- **Pages** extend a shared `BasePage` and expose high-level actions; they compose **components** for repeated UI patterns.
- **Fixtures** wire everything together: `easyrpa.fixture.ts` provides authenticated, pre-navigated pages, while `api.fixture.ts` provides authenticated API clients and per-test data context.
- **API clients** are used both for dedicated API tests and to set up/tear down data quickly in UI tests (e.g. creating an Automation Process via API, then verifying it in the UI).

## Code Quality

```bash
# Lint all TypeScript files
npm run code:check

# Format the codebase with Prettier
npm run code:format
```

Git hooks (via Husky) enforce quality automatically:

- **pre-commit** — runs lint and format checks.
- **pre-push** — runs the EasyRPA smoke suite before pushing.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.