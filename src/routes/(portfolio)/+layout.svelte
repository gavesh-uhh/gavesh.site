<script lang="ts">
	import '../../app.css';
	import {
		ROUTE_SEO,
		SITE_DESCRIPTION_DEFAULT,
		SITE_NAME,
		SITE_OG_IMAGE,
		SITE_TITLE_DEFAULT,
		SITE_URL
	} from '$lib/constants/site';
	import { preloadCode, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Background from './comp/Background.svelte';
	import Header from './comp/Header.svelte';
	import Navigation from './comp/Navigation.svelte';
	import { fade } from 'svelte/transition';
	let { children } = $props();
	let pathname = $derived($page.url.pathname);
	let routeSeo = $derived(ROUTE_SEO[pathname] ?? { title: SITE_TITLE_DEFAULT, description: SITE_DESCRIPTION_DEFAULT });
	let canonicalUrl = $derived(pathname === '/' ? SITE_URL : `${SITE_URL}${pathname}`);
	let pageTitle = $derived(routeSeo.title);
	let pageDescription = $derived(routeSeo.description);
	let personJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebSite',
					name: SITE_NAME,
					url: SITE_URL,
					description: SITE_DESCRIPTION_DEFAULT
				},
				{
					'@type': 'Person',
					name: SITE_NAME,
					url: SITE_URL,
					sameAs: ['https://github.com/gavesh-uhh']
				}
			]
		}).replace(/</g, '\\u003c')
	);

	onMount(() => {
		void preloadCode('/music');
		void preloadData('/music');
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={SITE_OG_IMAGE} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={SITE_OG_IMAGE} />

	<script type="application/ld+json">
		{@html personJsonLd}
	</script>
</svelte:head>

<div class="relative py-10 px-8 sm:py-20 sm:px-16 flex flex-col min-h-screen gap-6">
	<div class="z-20 flex flex-col gap-6">
		<Background />
		<Header />
		<Navigation />
		<hr class="opacity-25" />
		{#key pathname}
			<div in:fade={{ duration: 450, delay: 0 }} out:fade={{ duration: 0, delay: 0 }}>
				{@render children()}
			</div>
		{/key}
	</div>
</div>
