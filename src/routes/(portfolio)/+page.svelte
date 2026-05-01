<script lang="ts">
	import { Coffee, SquareArrowOutUpRight } from 'lucide-svelte';
	import { scramble } from '$lib/actions/scramble';
</script>

<div class="flex-1 flex flex-col gap-7">
	<div>
		<h1 class="font-semibold text-muted-foreground" use:scramble>About Me</h1>
		<p>
			{new Date().getFullYear() - 2006}-year-old student from
			<span class="text-green-400">Colombo, Sri Lanka</span> with an avid love for Tech, Software, Aeronautics
			and Minimalism.
		</p>
	</div>

	<div>
		<h1 class="font-semibold text-muted-foreground" use:scramble={{ duration: 700 }}>
			Skillset Overview
		</h1>
		<p>- Generalist, Fullstack</p>
		<p>- Java, C#, C++</p>
		<p>- Svelte, React, Tailwind</p>
	</div>

	<div>
		<h1 class="font-semibold text-muted-foreground" use:scramble={{ duration: 700 }}>
			Currently Learning
		</h1>
		<p>- Agentic Tooling</p>
		<p>- RTOS</p>
		<p>- Rust</p>
		<p>- Computer Graphics</p>
	</div>

	<div>
		<h1 class="font-semibold text-muted-foreground" use:scramble={{ duration: 700 }}>Interests</h1>
		<p>- Cosmology, Astronomy</p>
		<p>- Embedded Tech</p>
		<p>- IoT</p>
	</div>

	<div>
		<h1 class="font-semibold text-muted-foreground" use:scramble={{ duration: 700 }}>Contact</h1>
		<div class="flex flex-col">
			<div class="py-0">
				<a
					href="https://github.com/gavesh-uhh"
					class="underline-offset-0 hover:underline flex flex-row gap-2 w-fit h-fit items-center"
				>
					<SquareArrowOutUpRight class="w-4 h-4" />
					Github</a
				>
				<a
					href="https://open.spotify.com/user/312nfepxvdheyb3m4kllzzzaqd34?si=a267995b18bb425a"
					class="underline-offset-0 hover:underline flex flex-row gap-2 w-fit h-fit items-center"
				>
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/2024_Spotify_logo_without_text.svg/250px-2024_Spotify_logo_without_text.svg.png"
						class="w-4 h-4"
						alt="Spotify Logo"
					/>
					Spotify</a
				>
				<a
					href="https://www.linkedin.com/in/gavesh-saparamadu/"
					class="underline-offset-0 hover:underline flex flex-row gap-2 w-fit h-fit items-center"
				>
					<SquareArrowOutUpRight class="w-4 h-4" />
					LinkedIn</a
				>
				<a
					href="https://www.instagram.com/gavesh.uhh/"
					class="underline-offset-0 hover:underline flex flex-row gap-2 w-fit h-fit items-center"
				>
					<img
						src="https://cdn.iconscout.com/icon/free/png-256/free-instagram-logo-icon-download-in-svg-png-gif-file-formats--social-media-pack-logos-icons-1581910.png?f=webp&w=256"
						class="w-4 h-4"
						alt="Instagram Logo"
					/>
					Instagram</a
				>

				<a
					href="https://buymeacoffee.com/gaveshsaparamadu"
					class="underline-offset-0 hover:underline flex flex-row gap-2 w-fit h-fit items-center"
				>
					<Coffee class="w-4 h-4" />
					Buy a Coffee</a
				>
			</div>
		</div>
	</div>
</div>
