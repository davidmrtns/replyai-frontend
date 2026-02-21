import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    rules: {
      quotes: ['error', 'single'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': 'warn',
      'no-use-before-define': 'error',
      'valid-typeof': 'error',
      'use-isnan': 'error',
      eqeqeq: ['error', 'always'],
      'default-case': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': 'error',
      'prefer-spread': 'error',
      'require-await': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/jsx-pascal-case': 'error',
      'react/prefer-stateless-function': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/no-deprecated': 'error',
      'react/require-render-return': 'error',
      'react/jsx-handler-names': 'warn',
      'react/jsx-key': 'error',
      'react/no-multi-comp': ['warn', { ignoreStateless: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  tseslint.configs.recommended,
]);
