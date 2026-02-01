import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		alias: {
			$data: 'src/lib/data',
			$actions: 'src/Actions',
			$utils: 'src/utils'
		}
	},
	preprocess: [vitePreprocess()],
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
