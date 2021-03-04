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
	nuxtHydrated: false,
});
