import { error, isHttpError } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { jsonWithCors } from '$lib/server/http';

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';
const MAX_PAGES = 5;
const PER_PAGE = 200;
const DAYS = 7;

type LastFmRecentTrackDate = { uts: string };
type LastFmNowPlayingAttr = { nowplaying?: string };

type LastFmRecentTrack = {
	date?: LastFmRecentTrackDate;
	'@attr'?: LastFmNowPlayingAttr;
};

type LastFmRecentTracksResponse = {
	recenttracks?: {
		track?: LastFmRecentTrack[];
		'@attr'?: {
			totalPages?: string;
			page?: string;
			total?: string;
		};
	};
};

export type ScrobbleDay = {
	date: string;
	count: number;
};

export type ScrobblesResponse = {
	user: string;
	days: ScrobbleDay[];
	total: number;
	generatedAt: string;
};

const getRequiredEnvVar = (name: 'LASTFM_API_KEY' | 'LASTFM_API_USERNAME') => {
	const value = env[name];
	if (!value) {
		throw error(500, `Missing required environment variable: ${name}`);
	}
	return value;
};

const buildUrl = (params: Record<string, string | number>) => {
	const url = new URL(LASTFM_API_BASE);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, String(value));
	}
	return url.toString();
};

const toUtcDateKey = (utsSeconds: number) => {
	const d = new Date(utsSeconds * 1000);
	const year = d.getUTCFullYear();
	const month = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const GET = async () => {
	try {
		const apiKey = getRequiredEnvVar('LASTFM_API_KEY');
		const user = getRequiredEnvVar('LASTFM_API_USERNAME');

		const now = new Date();
		const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
		const windowStart = new Date(todayUtc);
		windowStart.setUTCDate(windowStart.getUTCDate() - (DAYS - 1));
		const fromUts = Math.floor(windowStart.getTime() / 1000);
		const toUts = Math.floor(now.getTime() / 1000);

		const counts = new Map<string, number>();
		let page = 1;
		let totalPages = 1;
		let total = 0;

		while (page <= totalPages && page <= MAX_PAGES) {
			const response = await fetch(
				buildUrl({
					method: 'user.getrecenttracks',
					user,
					api_key: apiKey,
					format: 'json',
					limit: PER_PAGE,
					from: fromUts,
					to: toUts,
					page
				})
			);

			if (!response.ok) {
				throw error(response.status, `Last.fm recenttracks failed: ${response.status}`);
			}

			const data = (await response.json()) as LastFmRecentTracksResponse;
			const block = data.recenttracks;
			const tracks = block?.track ?? [];
			const attr = block?.['@attr'];
			if (attr?.totalPages) {
				const parsed = parseInt(attr.totalPages, 10);
				if (!Number.isNaN(parsed)) {
					totalPages = parsed;
				}
			}

			for (const track of tracks) {
				if (!track.date?.uts) continue;
				const uts = parseInt(track.date.uts, 10);
				if (Number.isNaN(uts)) continue;
				if (uts < fromUts || uts > toUts) continue;
				const key = toUtcDateKey(uts);
				counts.set(key, (counts.get(key) ?? 0) + 1);
				total++;
			}

			page++;
		}

		const days: ScrobbleDay[] = [];
		for (let i = 0; i < DAYS; i++) {
			const d = new Date(windowStart);
			d.setUTCDate(d.getUTCDate() + i);
			const year = d.getUTCFullYear();
			const month = String(d.getUTCMonth() + 1).padStart(2, '0');
			const day = String(d.getUTCDate()).padStart(2, '0');
			const key = `${year}-${month}-${day}`;
			days.push({ date: key, count: counts.get(key) ?? 0 });
		}

		const payload: ScrobblesResponse = {
			user,
			days,
			total,
			generatedAt: new Date().toISOString()
		};

		return jsonWithCors(payload, {
			headers: {
				'cache-control': 'public, s-maxage=900, stale-while-revalidate=3600'
			}
		});
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}
		console.error('scrobbles error', err);
		throw error(500, 'Failed to load scrobbles.');
	}
};
