import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Using adapter-vercel explicitly with nodejs24.x runtime.
		// See https://svelte.dev/docs/kit/adapter-vercel for more information.
		adapter: adapter({
			runtime: 'nodejs24.x'
		})
	}
};

export default config;
