import {
	SET_THEME,
	TOGGLE_THEME,
	SET_MOBILE,
	SET_BANNER,
	SET_SIDEBAR,
	SET_BREADCRUMBS,
	ADD_BREADCRUMBS,
	PUSH_LOADING,
	POP_LOADING,
	SET_PANE_SIZES,
	STORE_NUXT_HYDRATED,
} from './constants';

export default {
	[SET_THEME](state, payload) {
		if (payload === 'dark' || payload === 'light') {
			state.theme = payload;
		}
	},
	[TOGGLE_THEME](state) {
		state.theme = state.theme === 'dark' ? 'light' : 'dark';
	},
	[SET_MOBILE](state, payload) {
		state.mobile = payload;
	},
	[SET_BANNER](state, payload) {
		state.banner = payload;
	},
	[SET_SIDEBAR](state, payload) {
		if (payload) {
			const { mini, collapsed } = payload;

			mini !== undefined && (state.sidebar.mini = mini);
			collapsed !== undefined && (state.sidebar.collapsed = collapsed);
		}
	},
	[SET_BREADCRUMBS](state, payload) {
		state.breadcrumbs = payload;
	},
	[ADD_BREADCRUMBS](state, payload) {
		state.breadcrumbs = [...state.breadcrumbs, ...payload];
	},
	[PUSH_LOADING](state, payload) {
		state.loading.push(payload);
	},
	[POP_LOADING](state, payload) {
		const { label } = payload;
		state.loading = state.loading
				.filter(_ => _.label !== label);
	},
	[SET_PANE_SIZES](state, payload) {
		const { navigation, code, output } = payload;
		navigation && (state.paneSizes.navigation = navigation);
		code && (state.paneSizes.code = code);
		output && (state.paneSizes.output = output);
	},
	[STORE_NUXT_HYDRATED](state, payload) {
		state.nuxtHydrated = payload;
	},
};
