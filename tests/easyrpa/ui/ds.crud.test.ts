import { test } from '@fixtures/easyrpa.fixture';

test.describe('Data Store', () => {
  test.describe('Creation', () => {
    test('should create data store via file upload', async ({ dataStorePage, dsContext }) => {
      await dataStorePage.createDataStore(dsContext.dsData);
      const { id } = await dataStorePage.expectDataStoreCreated();
      dsContext.createdDataStoreId = id;
      await dataStorePage.navigateBackAndWaitPage();
      await dataStorePage.table.expectRowToExist(dsContext.dsData.name);
    });

    test.afterEach(async ({ dsContext, dsClient }) => {
      await dsClient.deleteById(dsContext.createdDataStoreId);
    });
  });

  test.describe('Update', () => {
    test.beforeEach(async ({ dataStorePage, dsContext }) => {
      await dataStorePage.createDataStore(dsContext.dsData);
      ({ id: dsContext.createdDataStoreId } = await dataStorePage.expectDataStoreCreated());
      await dataStorePage.navigateBackAndWaitPage();
    });

    test('should rename data store', async ({ dataStorePage, dsContext }) => {
      const newName = `${dsContext.dsData.name}_renamed`;
      await dataStorePage.renameDataStore(dsContext.dsData.name, newName);
      await dataStorePage.table.expectRowToExist(newName);
    });

    test.afterEach(async ({ dsContext, dsClient }) => {
      await dsClient.deleteById(dsContext.createdDataStoreId);
    });
  });

  test.describe('Deletion', () => {
    test.beforeEach(async ({ dsClient, dsContext }) => {
      const { createBody } = await dsClient.create(dsContext.dsData);
      dsContext.createdDataStoreId = createBody.id;
    });

    test('should delete data store via check and delete in row', async ({ dataStorePage, dsContext }) => {
      await dataStorePage.refreshPage();
      await dataStorePage.deleteDataStore(dsContext.dsData.name);
      await dataStorePage.table.expectRowNotToExist(dsContext.dsData.name);
    });

    test.afterEach(async ({ dsContext, dsClient }) => {
      await dsClient.deleteById(dsContext.createdDataStoreId);
    });
  });
});
