export default () => ({
	debug: process.env.NODE_ENV !== 'production',
	theme: 'dark',
	mobile: false,
	loading: [],
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
	paneSizes: {
		examples: 60,
		tables: 25,
		query: 75,
		output: 40,
	},
	hideDisabled: false,
	timezone: 'local',
	nuxtHydrated: false,
	nuxtFetchPending: false,
});
