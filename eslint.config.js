import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'build/**', 'coverage/**', 'public/bundle.js', '*.config.js'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended, // Этот конфиг уже сам регистрирует плагин TS как '@' или '@typescript-eslint'
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {
            'simple-import-sort': simpleImportSort,
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parser: tseslint.parser,
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            'no-debugger': 'off',
            'no-console': 0,
            'class-methods-use-this': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    eslintConfigPrettier,
];
