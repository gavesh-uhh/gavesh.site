import { error, isHttpError } from '@sveltejs/kit';
import { jsonWithCors } from '$lib/server/http';
import { getArtistInfoByMbid } from '$lib/server/lastfm';

export const GET = async ({ url }) => {
	try {
		const mbid = url.searchParams.get('mbid');
		if (!mbid) {
			throw error(400, 'Missing required parameter: mbid');
		}

		const data = await getArtistInfoByMbid(mbid);
		if (!data.artist) {
			throw error(404, 'Artist not found');
		}

		return jsonWithCors(data);
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
