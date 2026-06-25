import { test } from '@fixtures/easyrpa.fixture';
import { AutomationProcessResponse } from '@api/models/automationProcess.model';

test.describe('Automation Process', () => {
  test.describe('Creation', () => {
    test('should create AP via input form', async ({ apPage, apContext }) => {
      await apPage.createAutomationProcess(apContext.apData);
      const { id } = await apPage.expectAutomationProcessCreated();
      apContext.createdAPId = id;
      await apPage.navigateBackAndWaitPage();
      await apPage.table.expectRowToExist(apContext.apData.name);
    });

    test('should create AP via file upload', async ({ apPage, apContext }) => {
      await apPage.uploadAutomationProcessJSON(apContext.apData);
      const { id } = await apPage.expectAutomationProcessCreated();
      apContext.createdAPId = id;
      await apPage.navigateBackAndWaitPage();
      await apPage.table.expectRowToExist(apContext.apData.name);
    });

    test.afterEach(async ({ apContext, apClient }) => {
      await apClient.deleteById(apContext.createdAPId);
    });
  });

  test.describe('Update', () => {
    let createBody: AutomationProcessResponse;

    test.beforeEach(async ({ apClient, apContext }) => {
      ({ createBody } = await apClient.create(apContext.apData));
      apContext.createdAPId = createBody.id;
    });

    test('should edit AP name', async ({ apPage, apContext }) => {
      const newName = `[edited] ${apContext.apData.name}`;
      const { name } = await apPage.updateAutomationProcess(createBody.name, { name: newName });
      await apPage.navigateBackAndWaitPage();
      await apPage.table.expectRowToExist(name);
    });

    test('should edit AP description', async ({ apPage, apContext }) => {
      const newDescription = `[edited] ${apContext.apData.description}`;
      await apPage.updateAutomationProcess(createBody.name, { description: newDescription });
      await apPage.navigateBackAndWaitPage();
      await apPage.table.expectRowToExist(newDescription);
    });

    test.afterEach(async ({ apContext, apClient }) => {
      await apClient.deleteById(apContext.createdAPId);
    });
  });

  test.describe('Deletion', () => {
    let createBody: AutomationProcessResponse;

    test.beforeEach(async ({ apClient, apContext }) => {
      ({ createBody } = await apClient.create(apContext.apData));
    });
    test('should delete AP via check and delete in row', async ({ apPage }) => {
      await apPage.deleteAutomationProcess(createBody.name);
      await apPage.table.expectRowNotToExist(createBody.name);
    });
    test('should delete AP via search by name, check first, delete in row', async ({ apPage }) => {
      await apPage.deleteAutomationProcess(createBody.name, { search: true, rowIndex: 0 });
      await apPage.table.expectToBeEmpty();
    });
    test('should delete AP via search by name, check all, delete in page header', async ({ apPage }) => {
      await apPage.deleteAutomationProcess(createBody.name, { search: true, checkAll: true });
      await apPage.table.expectToBeEmpty();
    });
  });
});
