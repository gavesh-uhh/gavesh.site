<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	class Star {
		x: number;
		y: number;
		radius: number;
		speed: number;
		ctx: CanvasRenderingContext2D | null;
		twinklePhase: number;
		twinkleSpeed: number;
		starType: 'normal' | 'bright' | 'dim';

		constructor(canvas: HTMLCanvasElement, x: number, y: number, radius: number, speed: number) {
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.speed = speed;
			this.ctx = canvas.getContext('2d');
			this.twinklePhase = Math.random() * Math.PI * 2;
			this.twinkleSpeed = Math.random() * 0.02 + 0.01;
			this.starType = Math.random() < 0.1 ? 'bright' : Math.random() < 0.3 ? 'dim' : 'normal';
		}

		update() {
			this.y += this.speed;
			this.twinklePhase += this.twinkleSpeed;
			
			if (this.y > canvas.height) {
				this.y = 0;
				this.x = Math.random() * canvas.width;
			}
		}

		draw() {
			if (!this.ctx) return;
			
			const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
			let alpha = twinkle;
			let size = this.radius;
			
			// Different star types
			switch (this.starType) {
				case 'bright':
					alpha = twinkle * 0.8 + 0.2;
					size = this.radius * 1.5;
					break;
				case 'dim':
					alpha = twinkle * 0.4 + 0.1;
					size = this.radius * 0.7;
					break;
				default:
					alpha = twinkle * 0.6 + 0.4;
			}
			
			this.ctx.beginPath();
			this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
			this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			this.ctx.fill();
			
			if (this.starType === 'bright') {
				this.ctx.beginPath();
				this.ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
				this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
				this.ctx.fill();
			}
		}
	}

	class Comet {
		x: number;
		y: number;
		radius: number;
		speedX: number;
		speedY: number;
		tailLength: number;
		ctx: CanvasRenderingContext2D | null;

		constructor(
			canvas: HTMLCanvasElement,
			x: number,
			y: number,
			radius: number,
			speedX: number,
			speedY: number,
			tailLength: number
		) {
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.speedX = speedX;
			this.speedY = speedY;
			this.tailLength = tailLength;
			this.ctx = canvas.getContext('2d');
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			if (this.x > canvas.width || this.y > canvas.height) {
				this.x = Math.random() * canvas.width * 0.5;
				this.y = -100;
			}
		}

		draw() {
			if (!this.ctx) return;
			const gradient = this.ctx.createLinearGradient(
				this.x,
				this.y,
				this.x - this.tailLength * this.speedX,
				this.y - this.tailLength * this.speedY
			);
			gradient.addColorStop(0, '#ffffff50');
			gradient.addColorStop(1, 'transparent');
			this.ctx.beginPath();
			this.ctx.fillStyle = '#ffffff50';
			this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.strokeStyle = gradient;
			this.ctx.lineWidth = this.radius;
			this.ctx.moveTo(this.x, this.y);
			this.ctx.lineTo(
				this.x - this.tailLength * this.speedX,
				this.y - this.tailLength * this.speedY
			);
			this.ctx.stroke();
		}
	}

	class ShootingStar {
		x: number;
		y: number;
		speedX: number;
		speedY: number;
		trail: { x: number; y: number; alpha: number }[];
		ctx: CanvasRenderingContext2D | null;
		life: number;
		maxLife: number;

		constructor(canvas: HTMLCanvasElement) {
			this.x = Math.random() * canvas.width;
			this.y = 0;
			this.speedX = Math.random() * 3 + 2;
			this.speedY = Math.random() * 2 + 1;
			this.trail = [];
			this.ctx = canvas.getContext('2d');
			this.life = 0;
			this.maxLife = Math.random() * 100 + 50;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			this.life++;
			
			// Add trail points
			this.trail.push({ x: this.x, y: this.y, alpha: 1 });
			if (this.trail.length > 20) this.trail.shift();
			
			// Fade trail
			this.trail.forEach(point => point.alpha *= 0.95);
		}

		draw() {
			if (!this.ctx) return;
			
			// Draw trail
			this.trail.forEach((point, index) => {
				this.ctx!.beginPath();
				this.ctx!.arc(point.x, point.y, 1, 0, Math.PI * 2);
				this.ctx!.fillStyle = `rgba(255, 255, 255, ${point.alpha * 0.6})`;
				this.ctx!.fill();
			});
			
			// Draw shooting star
			this.ctx.beginPath();
			this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
			this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
			this.ctx.fill();
		}

		isDead(): boolean {
			return this.life > this.maxLife || this.x > canvas.width || this.y > canvas.height;
		}
	}

	function getChance(chance: number): boolean {
		return Math.random() < chance;
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const starCount = 200;
		const cometCount = 5;
		const objects: (Star | Comet | ShootingStar)[] = [];
		let shootingStarTimer = 0;

		for (let i = 0; i < starCount; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height;
			const radius = Math.random() * 1;
			const speed = Math.random() * 0.1;
			objects.push(new Star(canvas, x, y, radius, speed));
		}

		for (let i = 0; i < cometCount; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height * 0.5;
			const radius = Math.random() * 2;
			const speedX = Math.random() * 2 + 1;
			const speedY = Math.random() * 0.5 + 0.5;
			const tailLength = Math.random() * 50 + 30;
			if (getChance(0.1)) objects.push(new Comet(canvas, x, y, radius, speedX, speedY, tailLength));
		}

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			// Spawn shooting stars occasionally
			shootingStarTimer++;
			if (shootingStarTimer > 300 && getChance(0.3)) { // Every ~5 seconds with 30% chance
				objects.push(new ShootingStar(canvas));
				shootingStarTimer = 0;
			}
			
			// Update and draw all objects
			objects.forEach((obj, index) => {
				obj.update();
				obj.draw();
			
				if (obj instanceof ShootingStar && obj.isDead()) {
					objects.splice(index, 1);
				}
			});
			
			requestAnimationFrame(animate);
		}

		animate();
	});
</script>

<div
	class="z-[-10] pointer-events-none overflow-hidden left-0 top-0 opacity-75 blur-xs h-screen fixed w-full"
>
	<canvas bind:this={canvas}></canvas>
</div>
