---
name: new-page
description:
  Scaffold a new Page Object or Component for EasyRPA following BasePage/BaseComponent patterns. Use when adding a new
  page or UI component.
allowed-tools: Read Glob Grep Write Edit
---

## Page Objects (`src/apps/easyrpa/pages/`)

Extend `BasePage`. Compose components as class properties:

```ts
import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages/BasePage';
import { Table, Dialog } from '@easyrpa/components';

export class MyPage extends BasePage {
  readonly table: Table;
  readonly dialog: Dialog;

  constructor(page: Page) {
    super(page);
    this.table = new Table(page.locator('.table-selector'));
    this.dialog = new Dialog(page.locator('.dialog-selector'));
  }

  async doSomething(): Promise<void> {
    // use this.page, this.table, this.dialog, and BasePage helpers
  }
}
```

After creating the page:

1. Export it from `src/apps/easyrpa/pages/index.ts`
2. Add a fixture for it in `src/fixtures/easyrpa.fixture.ts` if it needs login/navigation

## Components (`src/apps/easyrpa/components/`)

Extend `BaseComponent`. Receive a root `Locator` in the constructor, not `page`:

```ts
import { Locator } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components/BaseComponent';

export class MyComponent extends BaseComponent {
  constructor(root: Locator) {
    super(root);
  }

  async doSomething(): Promise<void> {
    // use this.root.locator('...') for children
  }
}
```

After creating the component, export it from `src/apps/easyrpa/components/index.ts`.

## Key BasePage helpers to reuse

Check `src/apps/easyrpa/pages/BasePage.ts` for shared methods (spinner waiting, header assertions, generic input/button
helpers) before implementing them again in a subclass.
