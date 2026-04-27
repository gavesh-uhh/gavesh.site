import { error, isHttpError } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { jsonWithCors } from '$lib/server/http';

const GITHUB_USER = 'gavesh-uhh';
const EVENTS_URL = `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`;
const MAX_COMMITS = 3;

type GitHubCommit = {
	sha: string;
	message: string;
	author?: { name?: string; email?: string };
	url?: string;
};

type GitHubPushEvent = {
	type: string;
	created_at: string;
	repo: { name: string };
	payload: {
		commits?: GitHubCommit[];
		ref?: string;
	};
};

export type RecentCommit = {
	repo: string;
	sha: string;
	shortSha: string;
	message: string;
	url: string;
	createdAt: string;
};

export type RecentCommitsResponse = {
	user: string;
	commits: RecentCommit[];
	generatedAt: string;
};

const firstLine = (value: string) => value.split('\n')[0].trim();

export const GET = async () => {
	try {
		const headers: Record<string, string> = {
			accept: 'application/vnd.github+json',
			'user-agent': 'gavesh.live',
			'x-github-api-version': '2022-11-28'
		};

		const token = env.GITHUB_TOKEN;
		if (token) {
			headers.authorization = `Bearer ${token}`;
		}

		const response = await fetch(EVENTS_URL, { headers });

		if (!response.ok) {
			throw error(response.status, `GitHub events fetch failed: ${response.status}`);
		}

		const events = (await response.json()) as GitHubPushEvent[];

		const commits: RecentCommit[] = [];
		for (const event of events) {
			if (event.type !== 'PushEvent') continue;
			const payloadCommits = event.payload?.commits ?? [];
			for (const commit of [...payloadCommits].reverse()) {
				if (!commit.sha || !commit.message) continue;
				const shortSha = commit.sha.slice(0, 7);
				commits.push({
					repo: event.repo.name,
					sha: commit.sha,
					shortSha,
					message: firstLine(commit.message),
					url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
					createdAt: event.created_at
				});
				if (commits.length >= MAX_COMMITS) break;
			}
			if (commits.length >= MAX_COMMITS) break;
		}

		const payload: RecentCommitsResponse = {
			user: GITHUB_USER,
			commits,
			generatedAt: new Date().toISOString()
		};

		return jsonWithCors(payload, {
			headers: {
				'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
			}
		});
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}
		console.error('recent commits error', err);
		throw error(500, 'Failed to load recent commits.');
	}
};
