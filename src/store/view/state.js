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
		examples: 60,
		tables: 25,
		query: 75,
		output: 40,
	},
	timezone: 'local',
	nuxtHydrated: false,
	nuxtFetchPending: false,
});
