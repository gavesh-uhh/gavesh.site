<script lang="ts">
	import { SquareArrowOutUpRight } from 'lucide-svelte';
	import { scramble } from '$lib/actions/scramble';

	type Link = {
		href: string;
		title: string;
		description?: string;
		logo?: string;
	};
</script>

<div class="flex-1 flex flex-col gap-4">
	{#snippet link(link: Link)}
		<div class="flex flex-col gap-0">
			<div class="flex items-center gap-2">
				<SquareArrowOutUpRight class="w-4 h-4" />
				<a
					data-sveltekit-preload-data="hover"
					data-sveltekit-preload-code="hover"
					href={link.href}
					class="hover:underline underline-offset-2">{link.title}</a
				>
			</div>
			{#if link.description}
				<p class="max-w-[400px] text-sm text-muted-foreground">{link.description}</p>
			{/if}
		</div>
	{/snippet}

	<h1 class="font-semibold text-muted-foreground" use:scramble>Links</h1>
	<div class="flex flex-col gap-6 px-4 py-2 border-l-2 border-white/50">
		{@render link({
			href: 'https://nibm.gavesh.me',
			title: 'NIBM Tools',
			description:
				'Easier way of viewing lectures. Easily sort through and view where lectures are happening.'
		})}
	</div>
</div>
