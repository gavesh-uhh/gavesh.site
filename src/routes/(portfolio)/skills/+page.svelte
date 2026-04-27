<script lang="ts">
	import Tech from './comp/Tech.svelte';
	import { scramble } from '$lib/actions/scramble';

	type Skill = {
		techStack: string;
		techName: string;
		invert?: boolean;
		iconSrc?: string;
	};

	type SkillSection = {
		title: string;
		skills: Skill[];
	};

	const LOBE_ICON_BASE =
		'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark';

	const skillSections: SkillSection[] = [
		{
			title: 'Languages',
			skills: [
				{ techStack: 'java', techName: 'Java' },
				{ techStack: 'csharp', techName: 'C#' },
				{ techStack: 'c', techName: 'Clang' },
				{ techStack: 'typescript', techName: 'Typescript' },
				{ techStack: 'javascript', techName: 'Javascript' },
				{ techStack: 'python', techName: 'Python' }
			]
		},
		{
			title: 'Frontend',
			skills: [
				{ techStack: 'svelte', techName: 'Svelte' },
				{ techStack: 'react', techName: 'React' },
				{ techStack: 'html5', techName: 'HTML & CSS' },
				{ techStack: 'tailwindcss', techName: 'Tailwind' }
			]
		},
		{
			title: 'Tools & Environment',
			skills: [
				{ techStack: 'git', techName: 'Git' },
				{ techStack: 'linux', techName: 'Linux' },
				{ techStack: 'docker', techName: 'Docker', invert: false },
				{ techStack: 'neovim', techName: 'Neovim' },
				{ techStack: 'arduino', techName: 'Arduino' }
			]
		},
		{
			title: 'AI Tooling',
			skills: [
				{ techStack: 'oc', techName: 'OpenCode', iconSrc: `${LOBE_ICON_BASE}/opencode.png` },
				{ techStack: 'claude', techName: 'Claude', iconSrc: `${LOBE_ICON_BASE}/claude.png` },
				{ techStack: 'cursor', techName: 'Cursor', iconSrc: `${LOBE_ICON_BASE}/cursor.png` },
				{ techStack: 'ollama', techName: 'Ollama', iconSrc: `${LOBE_ICON_BASE}/ollama.png` }
			]
		}
	];
</script>

<div class="flex-1 flex flex-col gap-5">
	<h1 class="font-semibold text-muted-foreground" use:scramble>Skills</h1>

	{#each skillSections as section}
		<section class="flex flex-col gap-2">
			<h2
				class="text-xs uppercase tracking-wider text-muted-foreground/80"
				use:scramble={{ duration: 600 }}
			>
				{section.title}
			</h2>
			<div class="flex flex-wrap gap-2 max-w-[900px]">
				{#each section.skills as skill}
					<Tech
						techStack={skill.techStack}
						techName={skill.techName}
						invert={skill.invert}
						iconSrc={skill.iconSrc}
					/>
				{/each}
			</div>
		</section>
	{/each}
</div>
