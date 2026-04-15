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
	let profileAsciiCells: string[] = [];
	let avatarImageLoaded = false;
	let revealProgress = 0;
	let profileScrambleFrame: number | undefined;
	let lastAsciiUpdate = 0;
	let revealStartTime: number | null = null;
	const PROFILE_GRID_ROWS = 15;
	const PROFILE_GRID_COLS = 26;
	const ASCII_UPDATE_MS = 28;
	const REVEAL_DURATION_MS = 3500;
	const ASCII_CHARS = `</>#@20615`;
	const SOFT_ASCII_CHARS = 'GAVESH';
	$: overlayOpacity = Math.max(0, 1 - revealProgress);
	$: imageOpacity = avatarImageLoaded ? Math.min(1, 0.35 + revealProgress) : 0;

	onMount(() => {
		profileAsciiCells = generateAsciiGrid(PROFILE_GRID_ROWS, PROFILE_GRID_COLS, 0);
		startAsciiLoop();

		void updateProfilePicture();
		void updateSpotify();
		const interval = setInterval(async () => {
			await updateSpotify();
		}, 10000);

		return () => {
			clearInterval(interval);
			if (profileScrambleFrame) {
				cancelAnimationFrame(profileScrambleFrame);
			}
		};
	});

	async function updateProfilePicture() {
		try {
			const response = await fetch('https://api.github.com/users/gavesh-uhh');
			const data = await response.json();
			avatarImageLoaded = false;
			revealProgress = 0;
			revealStartTime = null;
			startAsciiLoop();
			GITHUB_PROFILE_URL = data.avatar_url;
		} catch (error) {
			GITHUB_PROFILE_URL = DefaultProfile;
			avatarImageLoaded = true;
			revealProgress = 1;
		}
	}

	const onProfileImageLoad = () => {
		avatarImageLoaded = true;
	};

	const onProfileImageError = () => {
		GITHUB_PROFILE_URL = DefaultProfile;
		avatarImageLoaded = true;
		revealProgress = 1;
	};

	const pickAscii = () => ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
	const pickSoftAscii = () => SOFT_ASCII_CHARS[Math.floor(Math.random() * SOFT_ASCII_CHARS.length)];

	const generateAsciiGrid = (rows: number, cols: number, progress: number) => {
		const cells: string[] = [];
		for (let index = 0; index < rows * cols; index++) {
			const denseChance = Math.max(0.15, 1 - progress * 0.9);
			cells.push(Math.random() < denseChance ? pickAscii() : pickSoftAscii());
		}
		return cells;
	};

	const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

	const startAsciiLoop = () => {
		if (profileScrambleFrame) return;
		const step = (timestamp: number) => {
			if (timestamp - lastAsciiUpdate >= ASCII_UPDATE_MS) {
				if (avatarImageLoaded && revealStartTime === null) {
					revealStartTime = timestamp;
				}
				if (revealStartTime !== null) {
					const elapsed = timestamp - revealStartTime;
					const linear = Math.min(1, elapsed / REVEAL_DURATION_MS);
					revealProgress = easeOutCubic(linear);
				}
				profileAsciiCells = generateAsciiGrid(PROFILE_GRID_ROWS, PROFILE_GRID_COLS, revealProgress);
				lastAsciiUpdate = timestamp;
			}

			if (revealProgress >= 1) {
				profileScrambleFrame = undefined;
				return;
			}
			profileScrambleFrame = requestAnimationFrame(step);
		};
		profileScrambleFrame = requestAnimationFrame(step);
	};

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
		<div class="relative w-[120px] h-[120px]">
			<img
				class="w-[120px] h-[120px] rounded-lg object-cover transition-opacity duration-500 ease-out"
				style={`opacity: ${imageOpacity};`}
				src={GITHUB_PROFILE_URL}
				alt="Gavesh"
				on:load={onProfileImageLoad}
				on:error={onProfileImageError}
			/>
			{#if overlayOpacity > 0}
				<div
					class="absolute inset-0 rounded-lg bg-transparent text-muted-foreground/40 font-mono text-[8px] leading-none tracking-[-0.01em] overflow-hidden select-none pointer-events-none transition-opacity duration-150"
					style={`opacity: ${overlayOpacity};`}
				>
					<div
						class="h-full w-full grid place-items-center"
						style={`grid-template-columns: repeat(${PROFILE_GRID_COLS}, minmax(0, 1fr)); grid-template-rows: repeat(${PROFILE_GRID_ROWS}, minmax(0, 1fr));`}
					>
						{#each profileAsciiCells as cell}
							<span class="block w-full text-center">{cell}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<div class="cursor-pointer h-full flex flex-col justify-end">
			<div>
				<h1 class="font-hedvig text-3xl">Gavesh</h1>
				<h1 class="text-muted-foreground text-3xl">Saparamadu</h1>
			</div>
		</div>
	</div>
	<div class="flex gap-4 items-center flex-row">
		<div
			class="flex gap-4 items-center flex-row cursor-pointer hover:opacity-80 transition-opacity"
			role="button"
			tabindex="0"
			on:click={() => (window.location.href = '/music')}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					window.location.href = '/music';
				}
			}}
		>
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
								<a
									href={`https://open.spotify.com/search/${SPOTIFY_TRACK}`}
									class="hover:text-white transition-colors"
								>
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
