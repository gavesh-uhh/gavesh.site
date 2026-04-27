<script lang="ts">
	import { onMount } from 'svelte';
	import type { ContributionDay, ContributionsResponse } from '../../api/github/+server';

	type Props = {
		title?: string;
	};

	let { title = 'Code activity' }: Props = $props();

	let days = $state<ContributionDay[]>([]);
	let total = $state(0);
	let isLoading = $state(true);
	let errorMessage = $state('');
	let hovered = $state<ContributionDay | null>(null);

	onMount(() => {
		void load();
	});

	async function load() {
		try {
			const response = await fetch('/api/github');
			if (!response.ok) {
				throw new Error('Failed to load contributions.');
			}
			const data: ContributionsResponse = await response.json();
			days = data.days ?? [];
			total = data.totalLastYear ?? 0;
		} catch (err) {
			console.error(err);
			errorMessage = 'Could not load GitHub activity.';
		} finally {
			isLoading = false;
		}
	}

	let weeks = $derived.by<(ContributionDay | null)[][]>(() => {
		if (days.length === 0) return [];
		const byDate = new Map<string, ContributionDay>();
		for (const day of days) byDate.set(day.date, day);

		const first = new Date(days[0].date);
		const start = new Date(first);
		start.setDate(start.getDate() - start.getDay());

		const last = new Date(days[days.length - 1].date);
		const end = new Date(last);
		end.setDate(end.getDate() + (6 - end.getDay()));

		const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
		const weekCount = Math.ceil(totalDays / 7);

		const grid: (ContributionDay | null)[][] = [];
		const cursor = new Date(start);
		for (let w = 0; w < weekCount; w++) {
			const column: (ContributionDay | null)[] = [];
			for (let d = 0; d < 7; d++) {
				const iso = cursor.toISOString().slice(0, 10);
				const inRange = cursor >= first && cursor <= last;
				column.push(inRange ? (byDate.get(iso) ?? { date: iso, count: 0, level: 0 }) : null);
				cursor.setDate(cursor.getDate() + 1);
			}
			grid.push(column);
		}
		return grid;
	});

	let monthLabels = $derived.by<{ col: number; label: string }[]>(() => {
		if (weeks.length === 0) return [];
		const labels: { col: number; label: string }[] = [];
		let lastMonth = -1;
		weeks.forEach((column, col) => {
			const firstReal = column.find((c) => c !== null);
			if (!firstReal) return;
			const monthIndex = new Date(firstReal.date).getMonth();
			if (monthIndex !== lastMonth) {
				labels.push({
					col,
					label: new Date(firstReal.date).toLocaleString('en-US', { month: 'short' })
				});
				lastMonth = monthIndex;
			}
		});
		return labels;
	});

	const levelClass = (level: 0 | 1 | 2 | 3 | 4) => {
		switch (level) {
			case 0:
				return 'bg-white/[0.04] border border-white/[0.04]';
			case 1:
				return 'bg-white/20 border border-white/10';
			case 2:
				return 'bg-white/40 border border-white/10';
			case 3:
				return 'bg-white/60 border border-white/10';
			case 4:
				return 'bg-white/90 border border-white/20';
		}
	};

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});

	const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);
</script>

<section class="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 flex flex-col gap-3">
	<div class="flex items-start justify-between gap-3">
		<div>
			<h2 class="text-sm font-semibold text-white/90">{title}</h2>
			<p class="text-xs text-muted-foreground">
				{#if isLoading}
					loading contributions&hellip;
				{:else if errorMessage}
					{errorMessage}
				{:else}
					<span class="text-white/80">{formatNumber(total)}</span> contributions in the last year
				{/if}
			</p>
		</div>
		<a
			href="https://github.com/gavesh-uhh"
			target="_blank"
			rel="noopener noreferrer"
			class="text-xs text-muted-foreground hover:text-white transition-colors"
		>
			@gavesh-uhh &rarr;
		</a>
	</div>

	{#if !isLoading && !errorMessage && weeks.length > 0}
		<div class="flex flex-col gap-1 overflow-x-auto">
			<div class="relative h-3 text-[10px] text-muted-foreground/70 select-none">
				<div class="grid gap-[2px]" style={`grid-template-columns: repeat(${weeks.length}, 10px);`}>
					{#each weeks as _, col}
						{@const label = monthLabels.find((m) => m.col === col)?.label}
						<div class="h-3 relative">
							{#if label}
								<span class="absolute left-0 top-0 whitespace-nowrap">{label}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div
				class="grid gap-[2px]"
				style={`grid-template-columns: repeat(${weeks.length}, 10px); grid-template-rows: repeat(7, 10px);`}
				role="img"
				aria-label={`${formatNumber(total)} GitHub contributions in the last year`}
			>
				{#each weeks as column, colIdx}
					{#each column as cell, rowIdx}
						{#if cell === null}
							<div
								style={`grid-column: ${colIdx + 1}; grid-row: ${rowIdx + 1};`}
								class="h-[10px] w-[10px]"
							></div>
						{:else}
							<button
								type="button"
								class={`h-[10px] w-[10px] rounded-[2px] transition-transform duration-150 hover:scale-125 hover:border-white/40 ${levelClass(cell.level)}`}
								style={`grid-column: ${colIdx + 1}; grid-row: ${rowIdx + 1};`}
								title={`${cell.count} ${cell.count === 1 ? 'contribution' : 'contributions'} on ${formatDate(cell.date)}`}
								onmouseenter={() => (hovered = cell)}
								onmouseleave={() => (hovered = null)}
								onfocus={() => (hovered = cell)}
								onblur={() => (hovered = null)}
								aria-label={`${cell.count} contributions on ${formatDate(cell.date)}`}
							></button>
						{/if}
					{/each}
				{/each}
			</div>

			<div class="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
				<span class="min-h-[1em]">
					{#if hovered}
						<span class="text-white/85">{formatNumber(hovered.count)}</span>
						{hovered.count === 1 ? 'contribution' : 'contributions'} on
						<span class="text-white/70">{formatDate(hovered.date)}</span>
					{:else}
						Hover a commit cell for more details
					{/if}
				</span>
				<span class="flex items-center gap-1">
					<span>less</span>
					{#each [0, 1, 2, 3, 4] as level}
						<span
							class={`h-[10px] w-[10px] rounded-[2px] ${levelClass(level as 0 | 1 | 2 | 3 | 4)}`}
						></span>
					{/each}
					<span>more</span>
				</span>
			</div>
		</div>
	{:else if isLoading}
		<div class="h-[80px] w-full animate-pulse rounded-md bg-white/[0.04]"></div>
	{/if}
</section>
