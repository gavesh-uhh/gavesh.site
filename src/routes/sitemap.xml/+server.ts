import { SITE_URL } from '$lib/constants/site';

const ROUTES = ['/', '/projects', '/skills', '/music', '/links'] as const;

export const GET = async () => {
	const now = new Date().toISOString();
	const urlEntries = ROUTES.map((route) => {
		const loc = route === '/' ? SITE_URL : `${SITE_URL}${route}`;
		return `<url><loc>${loc}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${route === '/' ? '1.0' : '0.8'}</priority></url>`;
	}).join('');

	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};

