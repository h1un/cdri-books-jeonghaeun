import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

const NO_NULL_TERNARY_MESSAGE =
  '`조건 ? <X /> : null` 대신 early return 또는 `boolean && <X />`를 사용하세요.';

export default defineConfig(
  { ignores: ['dist', 'coverage'] },

  js.configs.recommended,
  tsConfigs.strictTypeChecked,
  tsConfigs.stylisticTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,

  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      // ── 조건부 렌더링 ──────────────────────────────
      'no-nested-ternary': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXExpressionContainer > ConditionalExpression:matches([alternate.raw='null'], [consequent.raw='null'], [alternate.type='Identifier'][alternate.name='undefined'], [consequent.type='Identifier'][consequent.name='undefined'])",
          message: NO_NULL_TERNARY_MESSAGE,
        },
        {
          selector:
            "ReturnStatement > ConditionalExpression:matches([alternate.raw='null'][consequent.type=/^JSX/], [consequent.raw='null'][alternate.type=/^JSX/])",
          message: NO_NULL_TERNARY_MESSAGE,
        },
      ],
      // `&&` 왼쪽은 boolean만 허용한다 (`{count && <X />}`처럼 0이 렌더링되는 문제 방지). 타입 기반 검사.
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        { allowString: false, allowNumber: false, allowNullableObject: true },
      ],

      // ── 컴포넌트 작성 ──────────────────────────────
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/button-has-type': 'error',

      // ── TypeScript ────────────────────────────────
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // React의 `onClick={() => setOpen(false)}` 같은 화살표 축약형은 허용한다.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],

      // ── 문법 ──────────────────────────────────────
      'prefer-template': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // ── import ────────────────────────────────────
      'import-x/no-default-export': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // 설정 파일은 default export가 관례이고 타입 정보가 없다.
  {
    files: ['*.config.{js,ts}', 'eslint.config.js'],
    extends: [tsConfigs.disableTypeChecked],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },

  eslintConfigPrettier,
);
