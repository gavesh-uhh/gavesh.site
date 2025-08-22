<script lang="ts">
	import { onMount } from 'svelte';

	import { SquareArrowOutUpRight } from 'lucide-svelte';

	import DefaultSong from '$lib/assets/default-song.webp';
	import DefaultProfile from '$lib/assets/default-profile.webp';

	let GITHUB_PROFILE_URL: string = DefaultProfile;
	let SPOTIFY_TRACK: string;
	let SPOTIFY_ARTIST: string;
	let SPOTIFY_ALBUM: string;
	let SPOTIFY_IMAGE: string;
	let isOnline: boolean = false;
	let paused: boolean = false;

	onMount(async () => {
		await updateProfilePicture();
		await updateSpotify();
		setInterval(async () => {
			await updateSpotify();
		}, 1000);
	});

	async function updateProfilePicture() {
		try {
			const response = await fetch('https://api.github.com/users/gavesh-uhh');
			const data = await response.json();
			GITHUB_PROFILE_URL = data.avatar_url;
		} catch (error) {
			GITHUB_PROFILE_URL = DefaultProfile;
		}
	}

	async function updateSpotify() {
		if (paused) return;
		try {
			const response = await fetch('/api/recent');
			if (!response.ok) {
				throw new Error('Failed to fetch Spotify data.');
			}

			const data: LastFMResponse = await response.json();
			if (data.online && data.recent) {
				SPOTIFY_TRACK = data.recent.track;
				SPOTIFY_ARTIST = data.recent.artist;
				SPOTIFY_ALBUM = data.recent.album;
				SPOTIFY_IMAGE = data.recent.image;
				isOnline = true;
			} else {
				isOnline = false;
			}
		} catch (err) {
			isOnline = false;
		}
	}

	interface LastFMResponse {
		online: boolean;
		recent: {
			track: string;
			artist: string;
			album: string;
			image: string;
		};
	}
</script>

<div class="flex flex-col sm:flex-row gap-12 sm:gap-16">
	<div class="flex flex-row gap-4 items-end">
		<div>
			<img class="max-w-[120px] max-h-[120px] rounded-lg" src={GITHUB_PROFILE_URL} alt="" />
		</div>
		<div class="cursor-pointer h-full flex flex-col justify-end">
			<div>
				<h1 class="font-hedvig text-3xl">Gavesh</h1>
				<h1 class="text-muted-foreground text-3xl">Saparamadu</h1>
			</div>
		</div>
	</div>
	<div class="flex gap-4 items-center flex-row">
		<div class="flex gap-4 items-center flex-row cursor-pointer hover:opacity-80 transition-opacity" role="button" on:click={() => window.location.href = '/music'}>
			<img
				loading="lazy"
				title={SPOTIFY_ALBUM}
				class="size-[50px] rounded-md"
				src={isOnline ? SPOTIFY_IMAGE : DefaultSong}
				alt={isOnline ? SPOTIFY_ALBUM : 'Album Cover for Default Picture'}
			/>
			<div class=" h-full flex flex-col justify-center">
				<div>
					{#if isOnline}
						<h1 class="font-semibold text-sm sm:text-md flex flex-row gap-1">
							<div class="text-xs">
								<span class="text-xs text-muted-foreground">Listening to </span>
								{SPOTIFY_TRACK}
							</div>
							<div>
								<a href={`https://open.spotify.com/search/${SPOTIFY_TRACK}`} class="hover:text-white transition-colors">
									<SquareArrowOutUpRight class="w-4 h-4" />
								</a>
							</div>
						</h1>
						<h1 class="text-xs text-muted-foreground">by {SPOTIFY_ARTIST}</h1>
					{:else}
						<h1 class="font-semibold text-xs">Not Listening</h1>
						<h1 class="text-xs text-muted-foreground">to anything</h1>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
