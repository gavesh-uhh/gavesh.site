import { redirect } from '@sveltejs/kit';
import { SPOTIFY_URL } from '$lib/constants/site';

export const load = () => {
	redirect(302, SPOTIFY_URL);
};
