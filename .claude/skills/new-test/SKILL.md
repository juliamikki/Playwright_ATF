---
name: new-test
description:
  Scaffold a new Playwright test file for EasyRPA following the project's fixture and API-driven patterns. Use when
  adding a new test file or test suite.
allowed-tools: Read Glob Grep Write Edit
---

Create a new test file under `tests/easyrpa/ui/` (UI) or `tests/easyrpa/api/` (API-only).

## Rules

**Always import from the fixture, never from `@playwright/test` directly:**

```ts
import { test, expect } from '@fixtures/easyrpa.fixture'; // UI tests
import { test, expect } from '@fixtures/api.fixture'; // API-only tests
```

**API-driven pattern (default for UI tests):** create data via API client in `beforeEach`, assert via UI, delete via API
client in `afterEach`:

```ts
test.beforeEach(async ({ apClient, apContext }) => {
  const { createBody } = await apClient.create(apContext.apData);
  apContext.createdAPId = createBody.id;
});

test('should ...', async ({ apPage, apContext }) => {
  // assert on UI using apContext values
});

test.afterEach(async ({ apClient, apContext }) => {
  await apClient.deleteById(apContext.createdAPId);
});
```

**UI-creation pattern** (only when the feature requires it, e.g. file upload): create via page object, capture the id
from the page, still delete via API client in `afterEach`. See `tests/easyrpa/ui/ds.crud.test.ts`.

## Available fixtures

From `api.fixture.ts`: `apiContext`, `authToken`, `apClient`, `usersClient`, `dsClient`, `apContext`, `dsContext` From
`easyrpa.fixture.ts` (extends api): `homePage`, `apPage`, `runsPage`, `dataStorePage`

Requesting `apPage` or `dataStorePage` automatically logs in and navigates to the correct module.

## Structure

```ts
import { test, expect } from '@fixtures/easyrpa.fixture';

test.describe('<Module>', () => {
  test.describe('<Action>', () => {
    test.beforeEach(async ({ ... }) => { /* setup */ });

    test('should ...', async ({ ... }) => { /* assertion */ });

    test.afterEach(async ({ ... }) => { /* cleanup via API */ });
  });
});
```

Use `@smoke` tag on critical path tests: `test('should ... @smoke', ...)`.
