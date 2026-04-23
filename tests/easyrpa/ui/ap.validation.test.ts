import { test } from '@fixtures/easyrpa.fixture';
import { AutomationProcessResponse, CreateAPRequest } from '@api/models/automationProcess.model';
import { testFiles } from '@easyrpa/test-data/files/invalid';

test.describe('Automation Process - Validation (business rules)', () => {
  let body: AutomationProcessResponse;
  let data: CreateAPRequest;

  test.beforeEach(async ({ apClient, apContext }) => {
    data = apContext.apData;
    ({ body } = await apClient.create(data));
    apContext.createdAPId = body.id;
  });

  test('should prevent creation of automation process with duplicate name', async ({ apPage }) => {
    await apPage.table.expectRowToExist(data.name);
    await apPage.createAutomationProcess(data);
    await apPage.message.expectTextAndClose(
      'Automation process with the same name already exists! Please, choose another name'
    );
  });

  test.afterEach(async ({ apContext, apClient }) => {
    if (apContext.createdAPId) {
      await apClient.deleteById(apContext.createdAPId);
    }
  });
});

test.describe('Automation Process - Validation (navigation)', () => {
  test('should discard unsaved changes when navigating back to list', async ({ apPage, apContext }) => {
    await apPage.openCreateForm();
    await apPage.fillAutomationProcessForm(apContext.apData);
    await apPage.navigateBack();
    await apPage.discardUnsavedChanges();
    await apPage.table.expectRowNotToExist(apContext.apData.name);
  });

  test('should discard unsaved changes when cancelling creation flow', async ({ apPage, apContext }) => {
    await apPage.openCreateForm();
    await apPage.fillAutomationProcessForm(apContext.apData);
    await apPage.clickButton('Cancel');
    await apPage.discardUnsavedChanges();
    await apPage.table.expectRowNotToExist(apContext.apData.name);
  });
});

test.describe('Automation Process - Upload validation (negative)', () => {
  test.describe('invalid file extension', () => {
    for (const file of testFiles.invalidExtensions) {
      test(`should reject upload of file with invalid extension (${file.name})`, async ({ apPage }) => {
        await apPage.uploadAutomationProcessWithInvalidExtension(file.path);
        await apPage.dialog.expectError('The file could not be uploaded because it is not a JSON file');
      });
    }
  });

  test.describe('invalid JSON content', () => {
    for (const file of testFiles.invalidJson) {
      test(`should reject upload of invalid JSON file (${file.name})`, async ({ apPage }) => {
        await apPage.uploadAutomationProcessWithInvalidFormat(file.path);
        await apPage.message.expectTextAndClose('Invalid JSON Format');
      });
    }
  });
});
