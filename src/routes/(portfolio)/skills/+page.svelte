<script lang="ts">
	import Tech from './comp/Tech.svelte';

	type Skill = {
		techStack: string;
		techName: string;
		invert?: boolean;
	};

type SkillSection = {
	title: string;
	skills: Skill[];
};

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
		}
	];
</script>

<div class="flex-1 flex flex-col gap-5">
	<h1 class="font-semibold text-muted-foreground">Skills</h1>

	{#each skillSections as section}
		<section class="flex flex-col gap-2">
			<h2 class="text-xs uppercase tracking-wider text-muted-foreground/80">{section.title}</h2>
			<div class="flex flex-wrap gap-2 max-w-[900px]">
				{#each section.skills as skill}
					<Tech techStack={skill.techStack} techName={skill.techName} invert={skill.invert} />
				{/each}
			</div>
		</section>
	{/each}
</div>
