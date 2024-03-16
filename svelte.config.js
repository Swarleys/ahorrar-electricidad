import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$data: 'src/lib/data',
			$actions: 'src/Actions',
			$utils: 'src/utils'
		}
	},
	preprocess: [vitePreprocess()],
	compilerOptions: {
		runes: true
	}
};

export default config;
