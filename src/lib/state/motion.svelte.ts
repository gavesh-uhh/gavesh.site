import { browser } from '$app/environment';

const STORAGE_KEY = 'gavesh.motion';

type MotionPref = 'auto' | 'reduced' | 'full';

const readInitial = (): MotionPref => {
	if (!browser) return 'auto';
	try {
		const stored = localStorage.getItem(STORAGE_KEY) as MotionPref | null;
		if (stored === 'reduced' || stored === 'full' || stored === 'auto') {
			return stored;
		}
	} catch {
		/* empty */
	}
	return 'auto';
};

const systemPrefersReduced = (): boolean => {
	if (!browser) return false;
	try {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	} catch {
		return false;
	}
};

export const motion = $state({
	pref: readInitial() as MotionPref,
	systemReduced: systemPrefersReduced()
});

export const isReduced = () =>
	motion.pref === 'reduced' || (motion.pref === 'auto' && motion.systemReduced);

export const setMotionPref = (value: MotionPref) => {
	motion.pref = value;
	if (browser) {
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch {
			/* empty */
		}
	}
};

export const toggleMotion = () => {
	const nextReduced = !isReduced();
	setMotionPref(nextReduced ? 'reduced' : 'full');
};

export const initMotionWatcher = () => {
	if (!browser) return () => {};
	try {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const handler = (event: MediaQueryListEvent) => {
			motion.systemReduced = event.matches;
		};
		motion.systemReduced = mq.matches;
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	} catch {
		return () => {};
	}
};
