export default () => ({
	debug: process.env.NODE_ENV !== 'production',
	theme: 'dark',
	mobile: false,
	sidebar: {
		mini: true,
		collapsed: false,
	},
	breadcrumbs: [],
	banner: {
		show: false,
		title: '',
		subtitle: '',
	},
	loading: [],
	paneSizes: {
		examples: 64,
		topic: 20,
		guide: 100,
		code: 50,
		live: 50,
		output: 33,
	},
	nuxtHydrated: false,
});
