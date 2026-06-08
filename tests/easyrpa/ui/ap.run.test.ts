/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@fixtures/easyrpa.fixture';
import { AutomationProcessResponse } from '@api/models/automationProcess.model';

test.describe('Automation Process Runs', () => {
  test.describe('Starting a run', () => {
    let createBody: AutomationProcessResponse;

    test.beforeEach(async ({ apClient, apContext }) => {
      ({ createBody } = await apClient.create(apContext.apData));
      apContext.createdAPId = createBody.id;
    });
    test('should allow to start an automation process run', async ({ apPage, apContext }) => {
      await apPage.openAutomationProcess(apContext.apData.name);
      const { id } = await apPage.startRun();
      await apPage.navigateBack();
      await apPage.expectRunStatus(id, 'In Progress');
    });

    test.afterEach(async ({ apContext, apClient }) => {
      //TODO: to move inside method
      if (apContext.createdAPId) {
        await apClient.deleteById(apContext.createdAPId);
      }
    });
  });

  test.describe('Stopping a run', () => {
    let createBody: AutomationProcessResponse;
    let startBody: any;
    let runId: string;

    test.beforeEach(async ({ apClient, apContext, apPage }) => {
      ({ createBody } = await apClient.create(apContext.apData));
      apContext.createdAPId = createBody.id;
      ({ startBody } = await apClient.startRun(apContext.createdAPId));
      apContext.createdRunId = startBody.id;
      await apPage.refreshPage();
      await apPage.openAutomationProcess(apContext.apData.name);
      runId = apContext.createdRunId?.toString() ?? '';
      await apPage.expectRunStatus(runId, 'In Progress');
    });

    test('should allow to stop a running process from the process details', async ({ apPage }) => {
      await apPage.stopRunRecord(runId);
      await apPage.expectRunStatus(runId, 'Stopping');
    });

    test('should allow to stop a running process from the run details view', async ({ apPage }) => {
      await apPage.openRun(runId);
      await apPage.stopRun();
      await apPage.navigateBack();
      await apPage.expectRunStatus(runId, 'Stopping');
    });

    test('should allow to stop a running process from the runs management view', async ({ apPage, runsPage }) => {
      await apPage.navigationMenu.goToModule('Runs Management');
      await runsPage.expectRunStatus(runId, 'In Progress');
      await runsPage.stopRun(runId);
      await apPage.expectRunStatus(runId, 'Stopping');
    });

    test('should allow to stop a running process from the runs management header', async ({ apPage, runsPage }) => {
      await apPage.navigationMenu.goToModule('Runs Management');
      await runsPage.expectRunStatus(runId, 'In Progress');
      await runsPage.stopRunRecordInHeader();
      await apPage.expectRunStatus(runId, 'Stopping');
    });

    test('should allow to stop all running processes', async ({ apPage, runsPage }) => {
      await apPage.navigationMenu.goToModule('Runs Management');
      await runsPage.expectRunStatus(runId, 'In Progress');
      await runsPage.stopAllRuns();
      await apPage.expectRunStatus(runId, 'Stopping');
    });

    test.afterEach(async ({ apContext, apClient }) => {
      if (apContext.createdAPId) {
        await apClient.deleteById(apContext.createdAPId);
      }
    });
  });
});
