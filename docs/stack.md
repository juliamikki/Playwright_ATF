# Project Stack

## Testing Framework

- **@playwright/test** : used for end-to-end browser automation.
- **@cucumber/cucumber** : enables BDD-style testing with Gherkin syntax.
- **tsx** : runs TypeScript directly without pre-compilation (used for Cucumber execution).

## Reporting

- **allure-playwright** : integrates Playwright with Allure test report.
- **allure-cucumberjs** : integrates Allure reporting with Cucumber tests.

## TypeScript

- **typescript** : adds static typing to JavaScript for better safety and maintainability.
- **@types/node** : type definitions for Node.js runtime APIs.
- **tsconfig-paths** : supports TypeScript path aliases at runtime (e.g., `@apps/...` imports).
- **jiti** : fast runtime TypeScript/ESM loader (used internally by tooling).

## Code Quality & Linting

- **eslint** : static code analysis tool to enforce code quality and consistency.
- **@eslint/js** : official ESLint recommended JavaScript rules.
- **@eslint/json** : linting rules for JSON files.
- **@eslint/markdown** : linting rules for Markdown files.
- **typescript-eslint** : enables ESLint support for TypeScript.
- **globals** : provides predefined global variables (used by ESLint config).

## Tooling

- **prettier** : automatically formats code to ensure consistency.
- **husky** : adds Git hooks (e.g., pre-commit checks).
- **rimraf** : cross-platform file deletion (used in scripts).
- **cross-env** : allows setting environment variables in a cross-platform way (used in scripts).
