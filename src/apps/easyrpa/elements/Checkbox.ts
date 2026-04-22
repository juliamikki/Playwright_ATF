import { BaseElement } from '@easyrpa/elements';

export class Checkbox extends BaseElement {
  async check(): Promise<void> {
    if (!(await this.locator.isChecked())) {
      await this.click();
    }
  }

  async uncheck(): Promise<void> {
    if (await this.locator.isChecked()) {
      await this.click();
    }
  }
}
