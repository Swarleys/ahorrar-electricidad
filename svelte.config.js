import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$lib: path.resolve('./src/lib'),
					$data: path.resolve('./src/lib/data'),
					$actions: path.resolve('./src/Actions')
				}
			},
			ssr: {
				noExternal: ['chart.js']
			}
		}
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
