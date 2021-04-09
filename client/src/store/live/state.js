export default () => ({
	active: false,
	containerId: undefined,
	prompt: 'bash-5.1#',
	history: [],
	executed: new Set(),
	pointer: 0,
	termStdin: './immudb -d',
	intro: {
		finished: false,
		value: '',
	},
});
