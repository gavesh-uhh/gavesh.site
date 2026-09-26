<script lang="ts">
	import { scramble } from '$lib/actions/scramble';
	import { PROJECT_HOSTS, projectUrl } from '$lib/constants/site';
	import GitHubHeatmap from '../comp/GitHubHeatmap.svelte';
	import RecentCommits from '../comp/RecentCommits.svelte';

	type Project = {
		name: string;
		description: string;
		href: string;
		linkLabel: string;
		techIcons: { src: string; alt: string }[];
		note?: string;
	};

	const projects: Project[] = [
		{
			name: 'RoadScore',
			description:
				'Edge-to-cloud telematics for driver safety. ESP32 units stream inertial, GNSS, and acoustic telemetry, and a TypeScript engine arbitrates road defects against driver misconduct to produce transparent, auditable safety scores in real time.',
			href: 'https://github.com/gavesh-uhh/roadscore-r1',
			linkLabel: 'Visit Github',
			techIcons: [
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original.svg',
					alt: 'Arduino'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
					alt: 'C++'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
					alt: 'TypeScript'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
					alt: 'Next.js'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
					alt: 'React'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
					alt: 'Supabase'
				}
			]
		},
		{
			name: 'Embeddy',
			description:
				'Embedded systems design assistant for Arduino, ESP32, and STM32. Describe a project and pick a board, and 9 parallel AI agents generate the schematic, wiring, starter firmware, and bill of materials in under 30 seconds.',
			href: 'https://github.com/gavesh-uhh/embeddy',
			linkLabel: 'Visit Github',
			techIcons: [
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
					alt: 'Next.js'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
					alt: 'TypeScript'
				},
				{
					src: 'https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png',
					alt: 'Gemini'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',
					alt: 'Firebase'
				}
			]
		},
		{
			name: 'NIBM Toolkit',
			description:
				'Website built for NIBM students to sort lecture schedules, save favorites, and track ongoing classes.',
			href: projectUrl('nibm'),
			linkLabel: `Visit ${PROJECT_HOSTS.nibm}`,
			techIcons: [
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
					alt: 'Svelte'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
					alt: 'TypeScript'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
					alt: 'Node.js'
				}
			]
		},
		{
			name: 'Sequence Diagram Generator',
			description: 'Generate sequence diagrams from text descriptions using Gemini 3.5 Flash.',
			href: projectUrl('seq'),
			linkLabel: `Visit ${PROJECT_HOSTS.seq}`,
			note: '~ fork of zenuml-core',
			techIcons: [
				{
					src: 'https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png',
					alt: 'Gemini'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
					alt: 'Vue'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
					alt: 'JavaScript'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
					alt: 'Node.js'
				}
			]
		},
		{
			name: 'smallcode',
			description:
				'A claude-code like harness specifically made for low parameter LLMS (eg: Qwen2.5:7B, Gemma4:e2b) for developement tasks',
			href: 'https://github.com/gavesh-uhh/smallcode',
			linkLabel: 'Visit Github',
			techIcons: [
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
					alt: 'TypeScript'
				},
				{
					src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/denojs/denojs-original.svg',
					alt: 'Deno.js'
				},
				{
					src: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/ollama.png',
					alt: 'Ollama'
				}
			]
		}
	];
</script>

<div class="flex-1 flex flex-col gap-5">
	<h1 class="font-semibold text-muted-foreground" use:scramble>Projects</h1>

	<GitHubHeatmap title="Code activity" />

	<RecentCommits title="Recent commits" />

	<div class="flex flex-col gap-3">
		{#each projects as project}
			<a
				href={project.href}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-2xl bg-white/5 px-4 py-4 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10"
			>
				<div class="flex items-center justify-between gap-3">
					<h2 class="text-lg sm:text-xl font-medium">{project.name}</h2>
					<span
						class="rounded-full bg-green-600/90 px-2 py-0.5 text-[10px] font-medium tracking-wide"
						>WIP</span
					>
				</div>

				{#if project.note}
					<p class="mt-1 text-xs italic text-muted-foreground">{project.note}</p>
				{/if}

				<p class="mt-2 max-w-[560px] text-xs sm:text-sm text-muted-foreground">
					{project.description}
				</p>

				<div class="mt-3 flex items-center justify-between gap-3">
					<div class="flex flex-wrap gap-1.5">
						{#each project.techIcons as tech}
							<img class="h-5 w-5" src={tech.src} alt={tech.alt} />
						{/each}
					</div>
					<span class="text-xs text-blue-400">{project.linkLabel} &rarr;</span>
				</div>
			</a>
		{/each}
	</div>
</div>
