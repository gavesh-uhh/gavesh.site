<script lang="ts">
	import { onMount } from 'svelte';
	import { Loader2 } from 'lucide-svelte';
	import type { PopularTrack, PopularTracksResponse } from '$lib/types/music';
	import { scramble } from '$lib/actions/scramble';
	import ListeningHeartbeat from '../comp/ListeningHeartbeat.svelte';

	let popularTracks: PopularTrack[] = [];
	let isLoading = true;
	let errorMessage = '';

	$: topFiveTracks = popularTracks.slice(0, 5);
	$: shownPlays = topFiveTracks.reduce((sum, track) => sum + track.playCount, 0);
	$: uniqueArtists = new Set(topFiveTracks.map((track) => track.artist)).size;
	$: topTrack = topFiveTracks[0];
	$: topTrackShare =
		shownPlays > 0 && topTrack ? Math.round((topTrack.playCount / shownPlays) * 100) : 0;
	$: maxPlays = topFiveTracks.reduce((max, track) => Math.max(max, track.playCount), 0);

	const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);
	const toRelativeBarWidth = (plays: number) => {
		if (maxPlays === 0) return 0;
		return Math.max(8, Math.round((plays / maxPlays) * 100));
	};

	onMount(() => {
		void loadTopTracks();
	});

	async function loadTopTracks() {
		try {
			const response = await fetch('/api/popular');
			if (!response.ok) {
				throw new Error('Failed to load music stats.');
			}

			const data: PopularTracksResponse = await response.json();
			popularTracks = (data.tracks ?? []).sort((a, b) => a.rank - b.rank);
		} catch (error) {
			errorMessage = 'Could not load listening stats right now.';
			console.error(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex-1 flex flex-col gap-6">
	<div class="flex flex-col gap-1">
		<h1 class="text-lg sm:text-2xl" use:scramble>Top 5 Tracks (Last 30 Days)</h1>
		<p class="text-xs sm:text-sm text-muted-foreground">
			Compact stats and ranking for your five most-played tracks.
		</p>
	</div>

	<ListeningHeartbeat />

	{#if isLoading}
		<div class="flex justify-center items-center py-10">
			<Loader2 class="w-8 h-8 animate-spin" />
		</div>
	{:else if errorMessage}
		<p class="text-sm text-muted-foreground border-l-2 border-white/30 pl-4 py-2">{errorMessage}</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
			<div class="rounded-2xl bg-white/5 p-4 border border-white/10">
				<p class="text-xs text-muted-foreground">Plays (Top 5)</p>
				<p class="text-xl font-semibold">{formatNumber(shownPlays)}</p>
			</div>
			<div class="rounded-2xl bg-white/5 p-4 border border-white/10">
				<p class="text-xs text-muted-foreground">Unique Artists</p>
				<p class="text-xl font-semibold">{uniqueArtists}</p>
			</div>
			<div class="rounded-2xl bg-white/5 p-4 border border-white/10">
				<p class="text-xs text-muted-foreground">#1 Share</p>
				<p class="text-xl font-semibold">{topTrackShare}%</p>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<h2 class="text-sm text-muted-foreground" use:scramble={{ duration: 600 }}>Ranking</h2>
			<div class="flex flex-col gap-2">
				{#each topFiveTracks as track}
					<div class="rounded-xl bg-white/5 p-3 border border-white/10">
						<div class="flex items-center gap-3">
							<div class="text-xs text-muted-foreground w-7">#{track.rank}</div>
							{#if track.image}
								<img
									src={track.image}
									alt={track.track}
									class="w-10 h-10 rounded-md object-cover"
								/>
							{:else}
								<div class="w-10 h-10 rounded-md bg-white/10"></div>
							{/if}
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate">{track.track}</p>
								<p class="text-xs text-muted-foreground truncate">{track.artist}</p>
							</div>
							<p class="text-xs sm:text-sm text-muted-foreground">
								{formatNumber(track.playCount)} plays
							</p>
						</div>
						<div class="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
							<div
								class="h-full bg-white/60 rounded-full"
								style={`width: ${toRelativeBarWidth(track.playCount)}%`}
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		{#if topTrack}
			<p class="text-xs text-muted-foreground border-l-2 border-white/25 pl-3 py-1">
				Top track is <span class="text-white">{topTrack.track}</span> by
				<span class="text-white">{topTrack.artist}</span>.
			</p>
		{/if}
	{/if}
</div>
