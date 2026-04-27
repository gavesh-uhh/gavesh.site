import { isReduced } from '$lib/state/motion.svelte';

const DENSE_CHARS = '</>#@20615';
const SOFT_CHARS = 'GAVESH';

export type ScrambleOptions = {
	duration?: number;
	updateMs?: number;
	once?: boolean;
	delay?: number;
	enabled?: boolean;
};

const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

const pickChar = (progress: number) => {
	const denseChance = Math.max(0.15, 1 - progress * 0.9);
	const pool = Math.random() < denseChance ? DENSE_CHARS : SOFT_CHARS;
	return pool[Math.floor(Math.random() * pool.length)];
};

export function scramble(node: HTMLElement, options: ScrambleOptions = {}) {
	const { duration = 900, updateMs = 32, once = true, delay = 0, enabled = true } = options;

	const originalText = (node.textContent ?? '').trimEnd();
	if (!enabled || originalText.length === 0) {
		return {
			destroy() {}
		};
	}

	const chars = Array.from(originalText);
	const total = chars.length;

	let rafId: number | undefined;
	let startTime: number | null = null;
	let lastUpdate = 0;
	let hasRun = false;
	let observer: IntersectionObserver | null = null;
	let timeoutId: number | undefined;

	const reset = () => {
		node.textContent = chars
			.map((ch) => (ch === ' ' || ch === '\n' || ch === '\t' ? ch : pickChar(0)))
			.join('');
	};

	const step = (timestamp: number) => {
		if (startTime === null) startTime = timestamp;
		const elapsed = timestamp - startTime;
		const linear = Math.min(1, elapsed / duration);
		const progress = easeOutCubic(linear);

		if (timestamp - lastUpdate >= updateMs) {
			const revealedCount = Math.floor(progress * total);
			let output = '';
			for (let i = 0; i < total; i++) {
				const ch = chars[i];
				if (ch === ' ' || ch === '\n' || ch === '\t') {
					output += ch;
					continue;
				}
				if (i < revealedCount) {
					output += ch;
				} else {
					output += pickChar(progress);
				}
			}
			node.textContent = output;
			lastUpdate = timestamp;
		}

		if (progress >= 1) {
			node.textContent = originalText;
			rafId = undefined;
			return;
		}

		rafId = requestAnimationFrame(step);
	};

	const run = () => {
		if (hasRun && once) return;
		if (isReduced()) {
			node.textContent = originalText;
			hasRun = true;
			return;
		}
		hasRun = true;
		startTime = null;
		lastUpdate = 0;
		reset();
		if (delay > 0) {
			timeoutId = window.setTimeout(() => {
				rafId = requestAnimationFrame(step);
			}, delay);
		} else {
			rafId = requestAnimationFrame(step);
		}
	};

	if ('IntersectionObserver' in window) {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						run();
						if (once && observer) {
							observer.disconnect();
							observer = null;
						}
					}
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(node);
	} else {
		run();
	}

	return {
		destroy() {
			if (rafId !== undefined) cancelAnimationFrame(rafId);
			if (timeoutId !== undefined) clearTimeout(timeoutId);
			if (observer) observer.disconnect();
			node.textContent = originalText;
		}
	};
}
