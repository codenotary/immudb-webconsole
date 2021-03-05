import {
	SET_THEME,
	TOGGLE_THEME,
	SET_MOBILE,
	SET_BANNER,
	SET_BREADCRUMBS,
	ADD_BREADCRUMBS,
	PUSH_LOADING,
	POP_LOADING,
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
	[STORE_NUXT_HYDRATED](state, payload) {
		state.nuxtHydrated = payload;
	},
};
