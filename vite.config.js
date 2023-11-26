import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';


/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// these are the aliases and paths to them
			$data: path.resolve('./src/lib/data'),
			$actions: path.resolve('./src/Actions'),
			$utils: path.resolve('./src/utils')
		}
	},
	ssr: {
		noExternal: ['chart.js']
	}
};

export default config;
