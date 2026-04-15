import { LASTFM_API_KEY, LASTFM_API_USERNAME } from '$env/static/private';
import { error } from '@sveltejs/kit';

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

type LastFmParams = Record<string, string | number | undefined>;

type LastFmImage = { '#text'?: string };
type LastFmArtist = { '#text': string };
type LastFmTopTrackArtist = { name: string };
type LastFmNowPlayingAttr = { nowplaying?: string };
type LastFmTrackRankAttr = { rank?: string };

export type RecentTrack = {
	name: string;
	artist: LastFmArtist;
	album: { '#text': string };
	image?: LastFmImage[];
	'@attr'?: LastFmNowPlayingAttr;
	mbid?: string;
};

export type TopTrack = {
	name: string;
	artist: LastFmTopTrackArtist;
	mbid?: string;
	playcount?: string;
	playCount?: string;
	'@attr'?: LastFmTrackRankAttr;
};

export type RecentTracksResponse = {
	recenttracks?: {
		track?: RecentTrack[];
	};
};

export type TopTracksResponse = {
	toptracks?: {
		track?: TopTrack[];
	};
};

export type TrackInfoResponse = {
	track?: {
		album?: {
			image?: LastFmImage[];
		};
	};
};

export type ArtistInfoResponse = {
	artist?: unknown;
};

const buildLastFmUrl = (method: string, params: LastFmParams = {}) => {
	const requestUrl = new URL(LASTFM_API_BASE);
	requestUrl.searchParams.set('method', method);
	requestUrl.searchParams.set('api_key', LASTFM_API_KEY);
	requestUrl.searchParams.set('format', 'json');

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			requestUrl.searchParams.set(key, String(value));
		}
	}

	return requestUrl.toString();
};

const fetchLastFm = async <T>(method: string, params: LastFmParams = {}): Promise<T> => {
	const response = await fetch(buildLastFmUrl(method, params));
	if (!response.ok) {
		throw error(response.status, `Last.fm request failed: ${method}`);
	}

	return (await response.json()) as T;
};

export const normalizeTrackName = (fullStr: string) => {
	const cleanedString = fullStr.replace(/\s*\(.*?\)\s*/g, ' ').trim();
	return cleanedString.length > 25 ? cleanedString.split('-')[0].trim() : cleanedString;
};

export const normalizeArtistName = (fullStr: string) => fullStr.replace(/\s{2,}/g, ' ');

export const getRecentTracks = () =>
	fetchLastFm<RecentTracksResponse>('user.getrecenttracks', {
		user: LASTFM_API_USERNAME
	});

export const getTopTracks = () =>
	fetchLastFm<TopTracksResponse>('user.gettoptracks', {
		user: LASTFM_API_USERNAME,
		period: '1month'
	});

export const getTrackInfoByMbid = (mbid: string) => {
	if (!mbid) {
		throw error(400, 'Missing required parameter: mbid');
	}

	return fetchLastFm<TrackInfoResponse>('track.getInfo', { mbid });
};

export const getArtistInfoByMbid = (mbid: string) => {
	if (!mbid) {
		throw error(400, 'Missing required parameter: mbid');
	}

	return fetchLastFm<ArtistInfoResponse>('artist.getinfo', { mbid });
};
