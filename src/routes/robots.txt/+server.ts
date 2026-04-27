import { SITE_URL } from '$lib/constants/site';

export const GET = async () => {
	const body = [`User-agent: *`, `Allow: /`, `Sitemap: ${SITE_URL}/sitemap.xml`].join('\n');

	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
