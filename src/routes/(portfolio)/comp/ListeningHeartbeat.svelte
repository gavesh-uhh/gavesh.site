<script lang="ts">
	import { onMount } from 'svelte';
	import type { ScrobbleDay, ScrobblesResponse } from '../../api/scrobbles/+server';

	let days = $state<ScrobbleDay[]>([]);
	let total = $state(0);
	let isLoading = $state(true);
	let errorMessage = $state('');

	const WIDTH = 600;
	const HEIGHT = 48;
	const PAD_X = 2;
	const PAD_Y = 4;

	onMount(() => {
		void load();
	});

	async function load() {
		try {
			const response = await fetch('/api/scrobbles');
			if (!response.ok) {
				throw new Error('Failed to load scrobbles.');
			}
			const data: ScrobblesResponse = await response.json();
			days = data.days ?? [];
			total = data.total ?? 0;
		} catch (err) {
			console.error(err);
			errorMessage = 'Could not load listening activity.';
		} finally {
			isLoading = false;
		}
	}

	let maxCount = $derived(days.reduce((max, day) => Math.max(max, day.count), 0));

	let points = $derived.by<{ x: number; y: number }[]>(() => {
		if (days.length === 0) return [];
		const innerWidth = WIDTH - PAD_X * 2;
		const innerHeight = HEIGHT - PAD_Y * 2;
		const stepX = days.length > 1 ? innerWidth / (days.length - 1) : 0;
		const peak = Math.max(1, maxCount);
		return days.map((day, index) => {
			const x = PAD_X + stepX * index;
			const ratio = day.count / peak;
			const y = PAD_Y + innerHeight - ratio * innerHeight;
			return { x, y };
		});
	});

	let polylinePoints = $derived(points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '));

	let areaPath = $derived.by(() => {
		if (points.length === 0) return '';
		const baseline = HEIGHT - PAD_Y;
		const first = points[0];
		const last = points[points.length - 1];
		const line = points.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
		return `M ${first.x.toFixed(2)} ${baseline} ${line} L ${last.x.toFixed(2)} ${baseline} Z`;
	});

	let hasData = $derived(!isLoading && !errorMessage && days.length > 0 && maxCount > 0);
</script>

<section class="flex flex-col gap-2">
	<div class="px-4 py-3">
		{#if isLoading}
			<div class="h-[48px] w-full animate-pulse rounded-md bg-white/[0.04]"></div>
		{:else if errorMessage}
			<p class="text-xs text-muted-foreground">{errorMessage}</p>
		{:else if !hasData}
			<p class="text-xs text-muted-foreground">no scrobbles in the last 7 days</p>
		{:else}
			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				preserveAspectRatio="none"
				class="block w-full h-[48px]"
				role="img"
				aria-label={`${total} scrobbles over the last 7 days`}
			>
				<defs>
					<linearGradient id="heartbeat-fill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="white" stop-opacity="0.18" />
						<stop offset="100%" stop-color="white" stop-opacity="0" />
					</linearGradient>
				</defs>
				<path d={areaPath} fill="url(#heartbeat-fill)" />
				<polyline
					points={polylinePoints}
					fill="none"
					stroke="white"
					stroke-opacity="0.7"
					stroke-width="1.25"
					stroke-linejoin="round"
					stroke-linecap="round"
					vector-effect="non-scaling-stroke"
				/>
			</svg>
		{/if}
	</div>
	<p class="text-xs text-muted-foreground">last 7 days</p>
</section>
