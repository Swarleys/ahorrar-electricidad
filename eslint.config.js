import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import svelteConfig from './svelte.config.js';

const baseGlobals = { ...globals.browser, ...globals.node };
const baseRules = js.configs.recommended.rules;
const tsRules = tsPlugin.configs.recommended.rules;

export default [
	{
		ignores: ['.svelte-kit/', 'build/', 'package/', 'node_modules/', '.vercel/', '.output/']
	},

	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: baseGlobals
		},
		rules: baseRules
	},

	{
		files: ['**/*.{ts,mts,cts}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: { sourceType: 'module', ecmaVersion: 2022 },
			globals: baseGlobals
		},
		plugins: { '@typescript-eslint': tsPlugin },
		rules: { ...baseRules, ...tsRules }
	},
	...svelte.configs['flat/recommended'],
	...svelte.configs.prettier,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.svelte'],
				svelteConfig
			},
			globals: baseGlobals
		},
		plugins: { '@typescript-eslint': tsPlugin },
		rules: { ...baseRules, ...tsRules }
	},
	...svelte.configs['flat/prettier'],
	{ ...prettier, files: ['**/*.{js,mjs,cjs,ts,mts,cts,svelte}'] }
];
