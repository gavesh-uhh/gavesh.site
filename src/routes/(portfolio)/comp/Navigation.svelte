<script lang="ts">
	import { page } from '$app/stores';
	import { Home, BookOpen, Link, SquareGanttChart, Music } from 'lucide-svelte';
	const currRoute = $derived($page.url.pathname);

	const baseClasses =
		'group flex items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-[background-color,color,transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:text-white hover:border-white/20';
	const activeClasses =
		'bg-accent text-white border-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]';
	const iconOnlyClasses = 'h-11 w-11 justify-center p-0';
	const textLinkClasses = 'h-11 gap-2.5 px-4';
	const iconClasses = 'w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-105';
</script>

<div class="flex flex-wrap gap-2 pt-2 w-fit rounded-3xl">
	<a
		href="/"
		class={`${baseClasses} ${iconOnlyClasses} ${currRoute === '/' ? activeClasses : ''}`}
		aria-current={currRoute === '/' ? 'page' : null}
		aria-label="Home"
	>
		<Home class={iconClasses} />
	</a>
	<a
		href="/projects"
		class={`${baseClasses} ${textLinkClasses} ${currRoute === '/projects' ? activeClasses : ''}`}
		aria-current={currRoute === '/projects' ? 'page' : null}
	>
		<SquareGanttChart class={iconClasses} />
		Projects</a
	>
	<a
		href="/skills"
		class={`${baseClasses} ${textLinkClasses} ${currRoute === '/skills' ? activeClasses : ''}`}
		aria-current={currRoute === '/skills' ? 'page' : null}
	>
		<BookOpen class={iconClasses} />
		Skills</a
	>

	<a
		href="/links"
		class={`${baseClasses} ${textLinkClasses} ${currRoute === '/links' ? activeClasses : ''}`}
		aria-current={currRoute === '/links' ? 'page' : null}
	>
		<Link class={iconClasses} />
		Links</a
	>
	<a
		href="/music"
		class={`${baseClasses} ${iconOnlyClasses} ${currRoute === '/music' ? activeClasses : ''}`}
		aria-current={currRoute === '/music' ? 'page' : null}
	>
		<Music class={iconClasses} /></a
	>
</div>
