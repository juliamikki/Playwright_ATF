import { Page } from '@playwright/test';
import { AutomationProcessesPage } from './AutomationProcessesPage';

export class RunsManagementPage extends AutomationProcessesPage {
  protected headerText = 'Runs Management';

  constructor(page: Page) {
    super(page);
  }

  async stopRun(runId: string): Promise<void> {
    const row = this.table.getRowByCellValue(runId);
    await row.check();
    await this.clickButton('Stop');
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.stopped);
  }

  async stopRunRecord(runId: string): Promise<void> {
    const row = this.table.getRowByCellValue(runId);
    await row.clickButton('Stop');
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.stopped);
  }

  async stopRunRecordInHeader(): Promise<void> {
    await this.table.getHeaderRow().check();
    await this.clickButton('Stop');
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.stopped);
  }

  async stopAllRuns(): Promise<void> {
    await this.clickButton('Stop all active');
    await this.confirmDialog('Stop', this.DIALOG_MESSAGES.stop);
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.stopped);
  }
}
