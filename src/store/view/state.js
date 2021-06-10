export default () => ({
	debug: process.env.NODE_ENV !== 'production',
	splash: true,
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
		color: 'primary',
	},
	paneSizes: {
		tables: 25,
		examples: 75,
		query: 33,
		output: 67,
	},
	hideNotActive: false,
	timezone: 'local',
	nuxtHydrated: false,
	nuxtFetchPending: false,
});
