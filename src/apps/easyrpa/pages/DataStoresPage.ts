import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';
import { SidePanel } from '@easyrpa/components';
import { CreateDataStoreData, DataStoreRecord } from '@api/models/dataStore.model';
import { convertRecordsToCsv } from '@factories/dataStoreDataFactory';

export class DataStoresPage extends BasePage {
  protected headerText = 'Data Stores';
  readonly sidePanel = new SidePanel(this.page);

  protected readonly DIALOG_HEADERS = {
    upload: 'Upload Data Store entries',
    confirmAction: 'Please, confirm your action'
  };

  protected readonly DIALOG_MESSAGES = {
    update: 'Are you sure you want to update selected data store?',
    delete: 'Are you sure you want to delete selected data store?'
  };

  protected readonly SUCCESS_MESSAGES = {
    created: 'New data store was successfully created!',
    updated: 'Data store was successfully updated!',
    deleted: 'Data store was successfully deleted!'
  };

  constructor(page: Page) {
    super(page);
  }

  // HELPERS:

  private async openCreateForm(): Promise<void> {
    await this.clickButton('Create New');
    await this.expectHeader('New Data Store');
  }

  protected async confirmDialog(action: 'Update' | 'Delete', message: string): Promise<void> {
    await this.dialog.expectHeader(this.DIALOG_HEADERS.confirmAction);
    await this.dialog.expectMessage(message);
    await this.dialog.clickButton(action);
    await this.dialog.waitForClosed();
  }

  private async uploadRecords(records: DataStoreRecord[]): Promise<void> {
    await this.clickButton('Upload file');
    await this.dialog.expectHeader(this.DIALOG_HEADERS.upload);
    await this.dialog.uploadFile('records.csv', convertRecordsToCsv(records), 'text/csv');
    await this.dialog.clickButton('Upload');
    await this.dialog.waitForClosed();
  }

  private extractDataStoreId(url: string): string {
    const match = url.match(/data-stores\/(\d+)/);
    if (!match?.[1]) {
      throw new Error(`Failed to extract Data Store ID from URL: ${url}`);
    }
    return match[1];
  }

  // CREATE:

  async createDataStore(data: CreateDataStoreData): Promise<void> {
    await this.openCreateForm();
    await this.setInput('Name', data.name);
    await this.setInput('Description', data.description);
    await this.uploadRecords(data.records);
    await this.clickButton('Save');
  }

  async expectDataStoreCreated(): Promise<{ id: number }> {
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.created);
    await this.expectHeader('Data Store Details');

    const id = this.extractDataStoreId(this.page.url());
    return { id: Number(id) };
  }

  // UPDATE (rename via the side panel opened from the list):

  async openEditPanel(name: string): Promise<void> {
    await this.table.getRowByCellValue(name).openSidePanel();
    await this.sidePanel.expectHeader('Edit Data Store');
  }

  async renameDataStore(currentName: string, newName: string): Promise<void> {
    await this.openEditPanel(currentName);
    await this.sidePanel.setInput('name', newName);
    await this.sidePanel.clickButton('Update');
    await this.confirmDialog('Update', this.DIALOG_MESSAGES.update);
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.updated);
  }

  // DELETE:

  /**
   * Deletes a Data Store based on the provided name and options.
   *
   * @remarks
   * Behavior depends on the provided options:
   * - `search`: filters the table by data store name before deletion
   * - `checkAll`: deletes all selected items using the header checkbox
   * - `rowIndex`: deletes a specific row by index (overrides name-based selection)
   *
   * If no `rowIndex` is provided, the row is identified by matching the data store name.
   */
  async deleteDataStore(
    name: string,
    options?: { search?: boolean; checkAll?: boolean; rowIndex?: number }
  ): Promise<void> {
    if (options?.search) {
      await this.searchFor(name);
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
        ? this.table.getRowByCellValue(name)
        : this.table.getRowByIndex(options.rowIndex);
    await row.check();
    await row.clickButton('Delete');
    await this.confirmDialog('Delete', this.DIALOG_MESSAGES.delete);
    await this.message.expectTextAndClose(this.SUCCESS_MESSAGES.deleted);
  }
}
