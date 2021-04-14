export default () => ({
	active: false,
	containerId: undefined,
	inProgress: false,
	prompt: 'bash-5.1#',
	history: [],
	executed: [],
	pointer: 0,
	termStdin: './immudb -d',
	intro: {
		finished: false,
		value: '',
	},
	command: '',
});
