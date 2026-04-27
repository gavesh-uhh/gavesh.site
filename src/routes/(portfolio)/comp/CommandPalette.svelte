<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import {
		Home,
		SquareGanttChart,
		BookOpen,
		Music,
		Link as LinkIcon,
		Github,
		Linkedin,
		Instagram,
		Coffee,
		Sparkles,
		Copy,
		Search,
		CornerDownLeft,
		ArrowUp,
		ArrowDown
	} from 'lucide-svelte';
	import { palette, closePalette, openPalette, togglePalette } from '$lib/state/palette.svelte';
	import { motion, isReduced, toggleMotion } from '$lib/state/motion.svelte';
	import { SITE_URL } from '$lib/constants/site';

	type Action = {
		id: string;
		label: string;
		hint?: string;
		group: 'Navigate' | 'External' | 'Actions';
		icon: typeof Home;
		keywords?: string;
		run: () => void | Promise<void>;
	};

	let inputEl: HTMLInputElement | null = $state(null);
	let selectedIndex = $state(0);
	let toast = $state<string | null>(null);
	let toastTimer: number | undefined;

	const showToast = (message: string) => {
		toast = message;
		if (toastTimer !== undefined) clearTimeout(toastTimer);
		toastTimer = window.setTimeout(() => {
			toast = null;
		}, 1800);
	};

	const copyToClipboard = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			showToast(`Copied ${label}`);
		} catch {
			showToast('Copy failed');
		}
	};

	const navTo = (href: string) => {
		closePalette();
		void goto(href);
	};

	const openExternal = (href: string) => {
		closePalette();
		window.open(href, '_blank', 'noopener,noreferrer');
	};

	let actions = $derived<Action[]>([
		{
			id: 'nav-home',
			label: 'Home',
			hint: '/',
			group: 'Navigate',
			icon: Home,
			keywords: 'about me profile identity',
			run: () => navTo('/')
		},
		{
			id: 'nav-projects',
			label: 'Projects',
			hint: '/projects',
			group: 'Navigate',
			icon: SquareGanttChart,
			keywords: 'work builds smallcode nibm',
			run: () => navTo('/projects')
		},
		{
			id: 'nav-skills',
			label: 'Skills',
			hint: '/skills',
			group: 'Navigate',
			icon: BookOpen,
			keywords: 'stack languages tools',
			run: () => navTo('/skills')
		},
		{
			id: 'nav-music',
			label: 'Music',
			hint: '/music',
			group: 'Navigate',
			icon: Music,
			keywords: 'listening lastfm spotify top tracks',
			run: () => navTo('/music')
		},
		{
			id: 'nav-links',
			label: 'Links',
			hint: '/links',
			group: 'Navigate',
			icon: LinkIcon,
			keywords: 'external bookmarks',
			run: () => navTo('/links')
		},
		{
			id: 'ext-github',
			label: 'GitHub',
			hint: 'github.com/gavesh-uhh',
			group: 'External',
			icon: Github,
			keywords: 'git repos code',
			run: () => openExternal('https://github.com/gavesh-uhh')
		},
		{
			id: 'ext-linkedin',
			label: 'LinkedIn',
			hint: 'linkedin.com/in/gavesh-saparamadu',
			group: 'External',
			icon: Linkedin,
			keywords: 'resume professional',
			run: () => openExternal('https://www.linkedin.com/in/gavesh-saparamadu/')
		},
		{
			id: 'ext-instagram',
			label: 'Instagram',
			hint: '@gavesh.uhh',
			group: 'External',
			icon: Instagram,
			keywords: 'social photos',
			run: () => openExternal('https://www.instagram.com/gavesh.uhh/')
		},
		{
			id: 'ext-coffee',
			label: 'Buy a Coffee',
			hint: 'buymeacoffee.com/gaveshsaparamadu',
			group: 'External',
			icon: Coffee,
			keywords: 'donate support tip',
			run: () => openExternal('https://buymeacoffee.com/gaveshsaparamadu')
		},
		{
			id: 'act-toggle-motion',
			label: isReduced() ? 'Enable background motion' : 'Reduce background motion',
			hint: `currently: ${isReduced() ? 'reduced' : 'full'}`,
			group: 'Actions',
			icon: Sparkles,
			keywords: 'animation stars comet accessibility prefers-reduced-motion',
			run: () => {
				toggleMotion();
				showToast(isReduced() ? 'Motion reduced' : 'Motion on');
			}
		},
		{
			id: 'act-copy-url',
			label: 'Copy site URL',
			hint: SITE_URL,
			group: 'Actions',
			icon: Copy,
			keywords: 'share link clipboard',
			run: () => copyToClipboard(SITE_URL, 'site URL')
		},
		{
			id: 'act-copy-github',
			label: 'Copy GitHub URL',
			hint: 'github.com/gavesh-uhh',
			group: 'Actions',
			icon: Copy,
			keywords: 'share profile clipboard',
			run: () => copyToClipboard('https://github.com/gavesh-uhh', 'GitHub URL')
		}
	]);

	const normalize = (value: string) => value.toLowerCase().trim();

	let filtered = $derived.by(() => {
		const q = normalize(palette.query);
		if (!q) return actions;
		return actions.filter((action) => {
			const haystack =
				`${action.label} ${action.hint ?? ''} ${action.keywords ?? ''} ${action.group}`.toLowerCase();
			return q.split(/\s+/).every((token) => haystack.includes(token));
		});
	});

	let grouped = $derived.by(() => {
		const map = new Map<string, Action[]>();
		for (const action of filtered) {
			const list = map.get(action.group) ?? [];
			list.push(action);
			map.set(action.group, list);
		}
		const order: Action['group'][] = ['Navigate', 'External', 'Actions'];
		return order.filter((g) => map.has(g)).map((g) => ({ group: g, items: map.get(g)! }));
	});

	$effect(() => {
		palette.query;
		palette.open;
		selectedIndex = 0;
	});

	$effect(() => {
		if (palette.open) {
			void tick().then(() => inputEl?.focus());
		}
	});

	const runSelected = () => {
		const item = filtered[selectedIndex];
		if (item) {
			void item.run();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			closePalette();
			return;
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (filtered.length === 0) return;
			selectedIndex = (selectedIndex + 1) % filtered.length;
			return;
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (filtered.length === 0) return;
			selectedIndex = (selectedIndex - 1 + filtered.length) % filtered.length;
			return;
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			runSelected();
			return;
		}
	};

	const handleGlobalKey = (event: KeyboardEvent) => {
		const mod = event.metaKey || event.ctrlKey;
		if (mod && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			togglePalette();
			return;
		}
		if (event.key === '/' && !palette.open) {
			const target = event.target as HTMLElement | null;
			const tag = target?.tagName?.toLowerCase();
			const isTyping = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
			if (!isTyping) {
				event.preventDefault();
				openPalette();
			}
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleGlobalKey);
		return () => {
			window.removeEventListener('keydown', handleGlobalKey);
			if (toastTimer !== undefined) clearTimeout(toastTimer);
		};
	});

	const isSelected = (action: Action) => filtered[selectedIndex]?.id === action.id;
</script>

{#if palette.open}
	<div
		class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
		role="dialog"
		aria-modal="true"
		aria-label="Command palette"
	>
		<button
			type="button"
			class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
			aria-label="Close command palette"
			onclick={closePalette}
		></button>

		<div
			class="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[hsl(240_10%_7%/0.95)] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
			onkeydown={handleKeydown}
			role="presentation"
		>
			<div class="flex items-center gap-3 px-4 py-3 border-b border-white/10">
				<Search class="w-4 h-4 text-muted-foreground" />
				<input
					bind:this={inputEl}
					bind:value={palette.query}
					type="text"
					placeholder="Jump to, open, copy..."
					class="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-sm text-white placeholder:text-muted-foreground/60 p-0"
					autocomplete="off"
					spellcheck="false"
				/>
				<kbd
					class="hidden sm:inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
					>esc</kbd
				>
			</div>

			<div class="max-h-[55vh] overflow-y-auto py-1">
				{#if filtered.length === 0}
					<div class="px-4 py-8 text-center text-sm text-muted-foreground">
						No matches for &ldquo;{palette.query}&rdquo;
					</div>
				{:else}
					{#each grouped as group}
						<div class="px-2 pt-2">
							<p class="px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
								{group.group}
							</p>
							<ul class="flex flex-col">
								{#each group.items as action (action.id)}
									{@const Icon = action.icon}
									<li>
										<button
											type="button"
											class={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 ${
												isSelected(action)
													? 'bg-white/10 text-white'
													: 'text-muted-foreground hover:bg-white/5 hover:text-white'
											}`}
											onmouseenter={() => {
												const idx = filtered.findIndex((a) => a.id === action.id);
												if (idx !== -1) selectedIndex = idx;
											}}
											onclick={() => action.run()}
										>
											<span
												class="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5"
											>
												<Icon class="w-3.5 h-3.5" />
											</span>
											<span class="flex-1 min-w-0">
												<span class="block text-sm text-white/90 truncate">{action.label}</span>
												{#if action.hint}
													<span class="block text-xs text-muted-foreground/80 truncate"
														>{action.hint}</span
													>
												{/if}
											</span>
											{#if isSelected(action)}
												<CornerDownLeft class="w-3.5 h-3.5 text-muted-foreground" />
											{/if}
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				{/if}
			</div>

			<div
				class="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2 text-[11px] text-muted-foreground"
			>
				<div class="flex items-center gap-3">
					<span class="flex items-center gap-1">
						<kbd
							class="inline-flex items-center rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono"
						>
							<ArrowUp class="w-2.5 h-2.5" />
						</kbd>
						<kbd
							class="inline-flex items-center rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono"
						>
							<ArrowDown class="w-2.5 h-2.5" />
						</kbd>
						<span>navigate</span>
					</span>
					<span class="flex items-center gap-1">
						<kbd
							class="inline-flex items-center rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono"
						>
							<CornerDownLeft class="w-2.5 h-2.5" />
						</kbd>
						<span>select</span>
					</span>
				</div>
				<span class="hidden sm:inline">
					{motion.pref === 'auto'
						? 'motion: auto'
						: motion.pref === 'reduced'
							? 'motion: reduced'
							: 'motion: full'}
				</span>
			</div>
		</div>

		{#if toast}
			<div
				class="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur"
			>
				{toast}
			</div>
		{/if}
	</div>
{/if}
