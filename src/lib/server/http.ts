import { json } from '@sveltejs/kit';

export const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET',
	'Access-Control-Allow-Headers': 'Content-Type'
} as const;

export const jsonWithCors = (payload: unknown, init: ResponseInit = {}) => {
	const headers = new Headers(init.headers);
	for (const [key, value] of Object.entries(CORS_HEADERS)) {
		headers.set(key, value);
	}

	return json(payload, {
		...init,
		headers
	});
};
