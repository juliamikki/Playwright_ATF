import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';
import { TabContainer } from '@easyrpa/components';
import { CreateAPRequest } from '@api/models/automationProcess.model';
import { convertAPDataToJson } from 'src/utils/apDataFactory';

export enum AutomationProcessTabs {
  Details = 'Details',
  Runs = 'Runs',
  ConfigurationParameters = 'Configuration Parameters',
  InputData = 'Input Data',
  Metrics = 'Metrics',
  Notifications = 'Notifications'
}

export class AutomationProcessesPage extends BasePage {
  protected headerText = 'Automation Processes';
  readonly tabContainer = new TabContainer<AutomationProcessTabs>(this.page);

  private readonly DIALOG_HEADERS = {
    uploadJson: 'Please, provide Automation Process JSON',
    confirmAction: 'Please, confirm your action'
  };

  private readonly DIALOG_MESSAGES = {
    update: 'Are you sure you want to update selected automation process?',
    delete: 'Are you sure you want to delete selected automation process?',
    leave: 'Are you sure you want to leave this page? All unsaved data will be lost.'
  };

  private readonly SUCCESS_MESSAGES = {
    created: 'New automation process was successfully created!',
    updated: 'Automation process was successfully updated!',
    deleted: 'Automation process was successfully deleted!'
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

  private async openAutomationProcess(apName: string): Promise<void> {
    await this.table.getRowByCellValue(apName).clickLink();
    await this.expectHeader('Automation Process Details');
    await this.tabContainer.expectTabToBeActive(AutomationProcessTabs.Runs);
  }

  private async confirmDialog(action: 'Update' | 'Delete' | "Don't save", message: string): Promise<void> {
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

    const id = this.extractCreatedId(this.page.url());
    const name = await this.getInput('Name');
    return { id: Number(id), name };
  }

  private extractCreatedId(url: string) {
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
}
