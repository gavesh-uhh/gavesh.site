import { error, isHttpError } from '@sveltejs/kit';
import { jsonWithCors } from '$lib/server/http';
import { getRecentTracks, normalizeArtistName, normalizeTrackName } from '$lib/server/lastfm';

export const GET = async () => {
	try {
		const recentTracksResponse = await getRecentTracks();
		const tracks = recentTracksResponse.recenttracks?.track;
		if (!Array.isArray(tracks) || tracks.length === 0) {
			throw error(404, 'Data missing: No recent tracks found.');
		}

		const lastTrack = tracks[0];
		const mostRecent = {
			track: normalizeTrackName(lastTrack.name),
			artist: normalizeArtistName(lastTrack.artist['#text']),
			album: lastTrack.album['#text'],
			image: lastTrack.image?.[2]?.['#text'] ?? ''
		};

		return jsonWithCors({
			online: Boolean(lastTrack['@attr']),
			recent: mostRecent,
			tracks
		});
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
