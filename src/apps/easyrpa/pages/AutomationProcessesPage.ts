import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';
import { TabContainer } from '@easyrpa/components';
import { CreateAPRequest } from '@api/models/automationProcess.model';
import { convertAPDataToJson } from '@factories/apDataFactory';

export enum AutomationProcessTabs {
  Details = 'Details',
  Runs = 'Runs',
  ConfigurationParameters = 'Configuration Parameters',
  InputData = 'Input Data',
  Metrics = 'Metrics',
  Notifications = 'Notifications'
}

export enum AutomationProcessRunTabs {
  History = 'History',
  EventLog = 'Event Log',
  Metrics = 'Metrics'
}

export class AutomationProcessesPage extends BasePage {
  protected headerText = 'Automation Processes';
  readonly tabContainer = new TabContainer<AutomationProcessTabs | AutomationProcessRunTabs>(this.page);

  protected readonly DIALOG_HEADERS = {
    uploadJson: 'Please, provide Automation Process JSON',
    confirmAction: 'Please, confirm your action'
  };

  protected readonly DIALOG_MESSAGES = {
    update: 'Are you sure you want to update selected automation process?',
    delete: 'Are you sure you want to delete selected automation process?',
    leave: 'Are you sure you want to leave this page? All unsaved data will be lost.',
    stop: 'Are you sure you want to stop all active runs?'
  };

  protected readonly SUCCESS_MESSAGES = {
    created: 'New automation process was successfully created!',
    updated: 'Automation process was successfully updated!',
    deleted: 'Automation process was successfully deleted!',
    stopped: 'Stop request has been sent'
  };

  constructor(page: Page) {
    super(page);
  }

  // HELPERS:

  async openCreateForm(): Promise<void> {
    await this.clickButton('Create New');
    await this.expectHeader('New Automation Process');
  }

  async fillAutomationProcessForm(data: CreateAPRequest): Promise<void> {
    const [groupId, artifactId, , versionId] = data.repositoryId.split(':');
    await this.setInput('Name', data.name);
    await this.setInput('Description', data.description);
    await this.setInput('Module Class', data.moduleClass);
    await this.setInput('Group Id', groupId);
    await this.setInput('Artifact Id', artifactId);
    await this.setInput('Version Id', versionId);
  }

  async discardUnsavedChanges(): Promise<void> {
    await this.confirmDialog("Don't save", this.DIALOG_MESSAGES.leave);
  }

  private async openUploadDialog(): Promise<void> {
    await this.openCreateForm();
    await this.clickButton('Upload');
    await this.dialog.expectHeader(this.DIALOG_HEADERS.uploadJson);
  }

  async openAutomationProcess(apName: string): Promise<void> {
    await this.table.getRowByCellValue(apName).clickLink();
    await this.expectHeader('Automation Process Details');
    await this.tabContainer.expectTabToBeActive(AutomationProcessTabs.Runs);
  }

  protected async confirmDialog(action: 'Update' | 'Delete' | 'Stop' | "Don't save", message: string): Promise<void> {
    await this.dialog.expectHeader(this.DIALOG_HEADERS.confirmAction);
    await this.dialog.expectMessage(message);
    await this.dialog.clickButton(action);
    await this.dialog.waitForClosed();
  }

  // CREATE / UPLOAD:

  async createAutomationProcess(data: CreateAPRequest): Promise<void> {
    await this.openCreateForm();
    await this.fillAutomationProcessForm(data);
    await this.clickButton('Create New');
  }

  async expectAutomationProcessCreated(): Promise<{ id: number; name: string }> {
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.created);
    await this.expectHeader('Automation Process Details');

    const id = this.extractAPId(this.page.url());
    const name = await this.getInput('Name');
    return { id: Number(id), name };
  }

  private extractAPId(url: string) {
    const match = url.match(/automation-processes\/(\d+)\/details/);
    if (!match?.[1]) {
      throw new Error(`Failed to extract Automation Process ID from URL: ${url}`);
    }
    return match[1];
  }

  async uploadAutomationProcessJSON(apData: CreateAPRequest): Promise<void> {
    await this.openUploadDialog();
    await this.dialog.uploadFile('ap.json', convertAPDataToJson(apData));
    await this.dialog.clickButton('Upload');
    await this.dialog.waitForClosed();
  }

  async uploadAutomationProcessWithInvalidExtension(filePath: string): Promise<void> {
    await this.openUploadDialog();
    await this.dialog.uploadFile(filePath);
  }

  async uploadAutomationProcessWithInvalidFormat(filePath: string): Promise<void> {
    await this.openUploadDialog();
    await this.dialog.uploadFile(filePath);
    await this.dialog.clickButton('Upload');
  }

  // UPDATE

  async updateAutomationProcess(
    apName: string,
    updates: { name?: string; description?: string }
  ): Promise<{ name: string }> {
    await this.openAutomationProcess(apName);
    await this.tabContainer.goToTab(AutomationProcessTabs.Details);
    if (updates.name) {
      await this.setInput('Name', updates.name);
    }
    if (updates.description) {
      await this.setInput('Description', updates.description);
    }
    await this.clickButton('Update');
    await this.confirmDialog('Update', this.DIALOG_MESSAGES.update);
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.updated);
    await this.expectHeader('Automation Process Details');

    const updatedName = await this.getInput('Name');
    return { name: updatedName };
  }

  // DELETE

  /**
   * Deletes an Automation Process based on the provided data and options.
   *
   * @remarks
   * Behavior depends on the provided options:
   * - `search`: filters the table by process name before deletion
   * - `checkAll`: deletes all selected items using the header checkbox
   * - `rowIndex`: deletes a specific row by index (overrides name-based selection)
   *
   * If no `rowIndex` is provided, the row is identified by matching the process name.
   *
   * @param data - The automation process data (used primarily for the name)
   * @param options - Optional deletion behavior configuration
   *
   * @throws {Error}
   * Throws if UI elements are not found or actions fail
   */
  async deleteAutomationProcess(
    apName: string,
    options?: { search?: boolean; checkAll?: boolean; rowIndex?: number }
  ): Promise<void> {
    if (options?.search) {
      await this.searchFor(apName);
    }

    if (options?.checkAll) {
      await this.table.getHeaderRow().check();
      await this.clickButton('Delete');
      await this.confirmDialog('Delete', this.DIALOG_MESSAGES.delete);
      await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.deleted);
      return;
    }

    const row =
      options?.rowIndex === undefined
        ? this.table.getRowByCellValue(apName)
        : this.table.getRowByIndex(options.rowIndex);
    await row.check();
    await row.clickButton('Delete');
    await this.confirmDialog('Delete', this.DIALOG_MESSAGES.delete);
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.deleted);
  }

  //RUN

  async startRun(): Promise<{ id: string }> {
    await this.clickButton('Start run');
    await this.expectHeader('Run');
    await this.tabContainer.expectTabToBeActive(AutomationProcessRunTabs.EventLog);
    const id = this.extractRunId(this.page.url());
    return { id };
  }

  async stopRunRecord(runId: string): Promise<void> {
    const row = this.table.getRowByCellValue(runId);
    await row.clickButton('Stop');
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.stopped);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async stopRun(runId?: string): Promise<void> {
    await this.clickButton('Stop');
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.stopped);
  }

  async openRun(runId: string): Promise<void> {
    await this.table.getRowByCellValue(runId).clickLink();
    await this.expectHeader('Run');
    await this.tabContainer.expectTabToBeActive(AutomationProcessRunTabs.History);
  }

  private extractRunId(url: string): string {
    const match = url.match(/run\/(\d+)/);
    if (!match?.[1]) {
      throw new Error(`Failed to extract Run ID from URL: ${url}`);
    }
    return match[1];
  }

  async expectRunStatus(id: string, status: string): Promise<void> {
    await this.table.expectRowToExist(id);
    const row = this.table.getRowByCellValue(id);
    await row.expectCellValueByHeader('Status', status);
  }
}
