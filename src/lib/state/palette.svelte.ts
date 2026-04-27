const state = $state({
	open: false,
	query: ''
});

export const palette = state;

export const openPalette = () => {
	state.open = true;
	state.query = '';
};

export const closePalette = () => {
	state.open = false;
	state.query = '';
};

export const togglePalette = () => {
	if (state.open) {
		closePalette();
	} else {
		openPalette();
	}
};
