// @ts-expect-error missing types
import report from 'multiple-cucumber-html-reporter';

report.generate({
  jsonDir: 'reports/cucumber',
  reportPath: 'reports/cucumber-html-report',
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest'
    },
    device: 'Local test machine',
    platform: {
      name: process.platform,
      version: process.version
    }
  }
} as const);
