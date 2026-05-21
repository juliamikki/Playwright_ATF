module.exports = {
  default: {
    paths: ['tests/easyrpa/bdd/features/**/*.feature'],
    require: ['tests/easyrpa/bdd/steps/**/*.ts', 'tests/easyrpa/bdd/support/**/*.ts'],
    format: ['progress', 'summary', 'allure-cucumberjs/reporter', 'json:reports/cucumber/cucumber-report.json'],
    formatOptions: {
      resultsDir: 'reports/allure-results'
    }
  }
};
