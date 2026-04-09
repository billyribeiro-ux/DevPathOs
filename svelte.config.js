import { mdsvex } from 'mdsvex';
import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';

const useStatic = process.env.ADAPTER === 'static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: useStatic
			? adapterStatic({ fallback: 'index.html' })
			: adapterNode({ out: 'build' }),
		alias: {
			$components: 'src/lib/components',
			$ui: 'src/lib/components/ui'
		}
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
