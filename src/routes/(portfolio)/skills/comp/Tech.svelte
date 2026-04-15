<script lang="ts">
	const {
		techStack,
		techName,
		invert
	}: { techStack: string; techName: string; invert?: boolean | null } = $props();
</script>

<div
	class="flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
>
	<img
		alt={techStack}
		class={`h-5 w-5 ${invert == true ? 'invert' : ''}`}
		src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${techStack}/${techStack}-original.svg`}
	/>
	<p class="text-sm font-medium text-white/90">{techName}</p>
</div>
