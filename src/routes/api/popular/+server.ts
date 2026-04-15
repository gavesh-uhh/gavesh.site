import { error, isHttpError } from '@sveltejs/kit';
import { jsonWithCors } from '$lib/server/http';
import type { PopularTrack, PopularTracksResponse } from '$lib/types/music';
import {
	getTopTracks,
	getTrackInfoByMbid,
	normalizeArtistName,
	normalizeTrackName
} from '$lib/server/lastfm';

export const GET = async () => {
	try {
		const topTracksResponse = await getTopTracks();
		const tracks = topTracksResponse.toptracks?.track;
		if (!Array.isArray(tracks) || tracks.length === 0) {
			throw error(404, 'Data missing: No top tracks found.');
		}

		const popularTracks: PopularTrack[] = await Promise.all(
			tracks.map(async (track, index) => ({
				track: normalizeTrackName(track.name),
				artist: normalizeArtistName(track.artist.name),
				image: await fetchTrackImage(track.mbid),
				// @ts-ignore type error shush
				playCount: Number.parseInt(track.playcount ?? track.playCount ?? '0', 10) || 0,
				// @ts-ignore type error shush
				rank: Number.parseInt(track['@attr']?.rank ?? `${index + 1}`, 10) || index + 1
			}))
		);

		const response: PopularTracksResponse = {
			tracks: popularTracks
		};

		return jsonWithCors(response);
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};

const fetchTrackImage = async (mbid?: string) => {
	if (!mbid) return null;
	try {
		const data = await getTrackInfoByMbid(mbid);
		return data.track?.album?.image?.[2]?.['#text'] || null;
	} catch (err) {
		console.error('Error fetching track image:', err);
		return null;
	}
};
