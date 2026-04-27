<script lang="ts">
	import { onMount } from 'svelte';
	import { SquareArrowOutUpRight } from 'lucide-svelte';
	import type { RecentCommit, RecentCommitsResponse } from '../../api/commits/+server';

	type Props = {
		title?: string;
	};

	let { title = 'Recent commits' }: Props = $props();

	let commits = $state<RecentCommit[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state('');

	onMount(() => {
		void load();
	});

	async function load() {
		try {
			const response = await fetch('/api/commits');
			if (!response.ok) {
				throw new Error('Failed to load commits.');
			}
			const data: RecentCommitsResponse = await response.json();
			commits = data.commits ?? [];
		} catch (err) {
			console.error(err);
			errorMessage = 'Could not load recent commits.';
		} finally {
			isLoading = false;
		}
	}

	const shortRepo = (full: string) => {
		const parts = full.split('/');
		return parts[parts.length - 1] ?? full;
	};

	const relativeTime = (iso: string) => {
		const then = new Date(iso).getTime();
		if (Number.isNaN(then)) return '';
		const diffSeconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
		if (diffSeconds < 60) return `${diffSeconds}s ago`;
		const diffMinutes = Math.floor(diffSeconds / 60);
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		const diffHours = Math.floor(diffMinutes / 60);
		if (diffHours < 24) return `${diffHours}h ago`;
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays < 30) return `${diffDays}d ago`;
		const diffMonths = Math.floor(diffDays / 30);
		if (diffMonths < 12) return `${diffMonths}mo ago`;
		const diffYears = Math.floor(diffDays / 365);
		return `${diffYears}y ago`;
	};
</script>

<section class="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 flex flex-col gap-3">
	<div class="flex items-start justify-between gap-3">
		<div>
			<h2 class="text-sm font-semibold text-white/90">{title}</h2>
			<p class="text-xs text-muted-foreground">
				{#if isLoading}
					loading&hellip;
				{:else if errorMessage}
					{errorMessage}
				{:else if commits.length === 0}
					no recent public commits
				{:else}
					last <span class="text-white/80">{commits.length}</span>
					{commits.length === 1 ? 'commit' : 'commits'} across public repos
				{/if}
			</p>
		</div>
		<a
			href="https://github.com/gavesh-uhh?tab=repositories"
			target="_blank"
			rel="noopener noreferrer"
			class="text-xs text-muted-foreground hover:text-white transition-colors"
		>
			repos &rarr;
		</a>
	</div>

	{#if !isLoading && !errorMessage && commits.length > 0}
		<ul class="flex flex-col divide-y divide-white/5">
			{#each commits as commit (commit.sha)}
				<li>
					<a
						href={commit.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center gap-3 py-2 text-xs sm:text-sm transition-colors duration-200 hover:bg-white/[0.02] rounded-md px-1 -mx-1"
					>
						<span class="text-muted-foreground shrink-0 truncate max-w-[120px] sm:max-w-[180px]">
							{shortRepo(commit.repo)}
						</span>
						<span
							class="font-mono text-[11px] text-muted-foreground/70 shrink-0 rounded bg-white/5 px-1.5 py-0.5 border border-white/5"
						>
							{commit.shortSha}
						</span>
						<span class="flex-1 min-w-0 truncate text-white/85 group-hover:text-white">
							{commit.message}
						</span>
						<span
							class="hidden sm:inline text-[11px] text-muted-foreground/70 shrink-0 tabular-nums"
						>
							{relativeTime(commit.createdAt)}
						</span>
						<SquareArrowOutUpRight
							class="w-3 h-3 text-muted-foreground/60 shrink-0 transition-colors group-hover:text-white/80"
						/>
					</a>
				</li>
			{/each}
		</ul>
	{:else if isLoading}
		<div class="flex flex-col gap-2">
			{#each Array(3) as _}
				<div class="h-7 w-full animate-pulse rounded-md bg-white/[0.04]"></div>
			{/each}
		</div>
	{/if}
</section>
