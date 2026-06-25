---
name: run-tests
description:
  Run EasyRPA test suites. Use when asked to run tests, smoke tests, or any test suite. Pass the suite name as argument.
arguments: [suite]
allowed-tools: Bash(npm run test:*)
---

Run: `npm run test:easyrpa:$ARGUMENTS`

**Suite names:**

- `crud` — Automation Process CRUD (UI, Chrome)
- `api` — API tests
- `api:smoke` — @smoke-tagged API tests
- `bdd` — Cucumber/Gherkin scenarios
- `smoke` — @smoke-tagged UI tests, headless
- `crossbrowser` — Chrome + Firefox + Edge + WebKit
- `mobile:smoke` — Android + iOS emulators

For the full UI suite (no suffix): `npm run test:easyrpa`

For a single file: `npx playwright test <path> --project=easyrpa-chrome` For a single test by title:
`npx playwright test --project=easyrpa-chrome -g "<title>"` For headed/debug: add `--headed` or `--debug`
