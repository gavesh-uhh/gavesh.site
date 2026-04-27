import { error, isHttpError } from '@sveltejs/kit';
import { jsonWithCors } from '$lib/server/http';

const GITHUB_USER = 'gavesh-uhh';
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

type RawContribution = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};

type RawResponse = {
	total?: Record<string, number>;
	contributions?: RawContribution[];
};

export type ContributionDay = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionsResponse = {
	user: string;
	totalLastYear: number;
	days: ContributionDay[];
	generatedAt: string;
};

export const GET = async () => {
	try {
		const response = await fetch(CONTRIB_API, {
			headers: {
				accept: 'application/json',
				'user-agent': 'gavesh.live'
			}
		});

		if (!response.ok) {
			throw error(response.status, `Upstream contribution fetch failed: ${response.status}`);
		}

		const data = (await response.json()) as RawResponse;
		const contributions = Array.isArray(data.contributions) ? data.contributions : [];

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const cutoff = new Date(today);
		cutoff.setDate(cutoff.getDate() - 364);

		const days: ContributionDay[] = contributions
			.filter((entry) => {
				const d = new Date(entry.date);
				return d >= cutoff && d <= today;
			})
			.map((entry) => ({
				date: entry.date,
				count: entry.count,
				level: entry.level
			}));

		const totalLastYear = days.reduce((sum, day) => sum + day.count, 0);

		const payload: ContributionsResponse = {
			user: GITHUB_USER,
			totalLastYear,
			days,
			generatedAt: new Date().toISOString()
		};

		return jsonWithCors(payload, {
			headers: {
				'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
			}
		});
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}
		console.error('github contributions error', err);
		throw error(500, 'Failed to load GitHub contributions.');
	}
};
