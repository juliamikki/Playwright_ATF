/**
 * ESLint configuration for the project.
 *
 * @remarks
 * This configuration defines linting rules across JS, TS, JSON, Markdown, and CSS files.
 * It aims to enforce code quality, consistency, and maintainability across all layers of the project.
 *
 * @section Base Configurations
 * - `js.configs.recommended`: standard ESLint recommended rules for JS.
 * - `typescript-eslint.configs.recommended`: TS-specific linting rules and best practices.
 * - `json.configs.recommended`: valid and consistent JSON formatting.
 * - `markdown.configs.recommended`: code blocks and formatting inside Markdown files.
 *
 * @section Language Options
 * - `globals.node`: enables Node.js global variables (e.g., `process`, `__dirname`).
 *
 * @section Rules
 *
 * ### Async Handling
 * - `require-await`: ensures async functions contain `await`, preventing accidental async declarations.
 * - `no-return-await`: disallows redundant `return await` usage.
 *
 * ### Code Cleanliness
 * - `@typescript-eslint/no-unused-vars`: warns about unused variables (ignores `_`- prefixed args).
 * - `no-console`: warns when using console statements.
 * - `no-useless-concat`: prevents unnecessary string concatenation.
 *
 * ### Safety & Correctness
 * - `no-undef`: disallows usage of undeclared variables.
 * - `no-shadow`: prevents variable shadowing.
 * - `no-implicit-globals`: prevents accidental global variable declarations.
 * - `eqeqeq`: enforces strict equality (`===`, `!==`).
 *
 * ### Code Style & Structure
 * - `curly`: requires braces for all control statements.
 * - `consistent-return`: ensures functions either always return a value or never do.
 * - `dot-notation`: enforces dot notation over bracket notation where possible.
 *
 * ### Imports
 * - `no-duplicate-imports`:prevents duplicate import statements.
 *
 * ### Complexity & Maintainability
 * - `max-lines-per-function`: warns if a function exceeds 30 lines.
 * - `max-nested-callbacks`: limits callback nesting depth to 2.
 * - `complexity`: restricts cyclomatic complexity to 8.
 *
 * ### Naming Conventions
 * - `camelcase`: enforces camelCase naming (excluding object properties).
 * - `new-cap`: enforces constructor naming conventions;
 *   allows BDD-style exceptions: `Given`, `When`, `Then`, `Before`, `After`.
 *
 * @packageDocumentation
 */
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  json.configs.recommended,
  markdown.configs.recommended,

  {
    files: ['**/*.{js,cjs,ts}'],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      'require-await': 'error',
      'no-return-await': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-useless-concat': 'error',
      'no-undef': 'error',
      'no-shadow': 'error',
      'no-implicit-globals': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'consistent-return': 'error',
      'dot-notation': 'error',
      'no-duplicate-imports': 'error',
      'max-lines-per-function': ['warn', 30],
      'max-nested-callbacks': ['warn', 3],
      complexity: ['warn', 8],
      camelcase: ['error', { properties: 'never' }],
      'new-cap': [
        'error',
        {
          capIsNew: true,
          newIsCap: true,
          properties: true,
          capIsNewExceptionPattern: 'Given|When|Then|Before|After'
        }
      ]
    }
  },
  {
    files: ['**/*.spec.{js,ts}', '**/*.test.{js,ts}'],
    rules: {
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off'
    }
  }
]);
