<script lang="ts">
    import { onMount } from "svelte";

	import { Loader2 } from "lucide-svelte"
    
    interface Track {
        track: string;
        artist: string;
        image: string | null;
    }
    
	let popularTracks: Track[] = [];
	let isLoading = true;
	
	onMount(async () => {
		try {
			const response = await fetch("/api/popular");
			const data = await response.json();
			popularTracks = data.tracks;
		} catch (error) {
			console.error("Failed to fetch tracks:", error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="flex-1 flex flex-col gap-4">
	<div class="flex flex-col gap-10">
		<div>
			<h1 class="text-lg sm:text-2xl mb-2">Most Played Tracks (Last 30 Days)</h1>
			<div class="border-white/25  py-2">
				
				{#if isLoading}
					<div class="flex justify-center items-center py-8">
						<Loader2 class="w-8 h-8 animate-spin" />
					</div>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
						{#each popularTracks as track, index}
							<div class="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
								<div class="flex-shrink-0">
									{#if track.image}
										<img 
											src={track.image} 
											alt={track.track}
											class="w-10 h-10 rounded-md object-cover"
										/>
									{:else}
										<div class="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
											<svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
											</svg>
										</div>
									{/if}
								</div>
								
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2">
										<h3 class="text-sm font-medium text-white truncate">{track.track}</h3>
									</div>
									<p class="text-xs text-white/60 truncate">{track.artist}</p>
								</div>
								
								<div class="flex-shrink-0">
									<svg class="w-4 h-4 mr-2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
									</svg>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>