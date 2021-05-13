import {
	SPLASH,
	THEME,
	MOBILE,
	BANNER,
	SIDEBAR_MINI,
	SIDEBAR_COLLAPSED,
	BREADCRUMBS,
	IS_LOADING,
	PANE_SIZES,
	TIMEZONE,
	HIDE_NOT_ACTIVE,
	IS_NUXT_HYDRATED,
	IS_FETCH_PENDING,
} from './constants';

export default {
	[SPLASH](state) {
		return state.splash;
	},
	[THEME](state) {
		return state.theme;
	},
	[MOBILE](state) {
		return state.mobile;
	},
	[BANNER](state) {
		return state.banner;
	},
	[SIDEBAR_MINI](state) {
		return state.sidebar && state.sidebar.mini;
	},
	[SIDEBAR_COLLAPSED](state) {
		return state.sidebar && state.sidebar.collapsed;
	},
	[BREADCRUMBS](state) {
		return state.breadcrumbs;
	},
	[IS_LOADING](state) {
		return state.loading && !!state.loading.length;
	},
	[PANE_SIZES](state) {
		return state.paneSizes;
	},
	[TIMEZONE](state) {
		return state.timezone;
	},
	[HIDE_NOT_ACTIVE](state) {
		return state.hideNotActive;
	},
	[IS_NUXT_HYDRATED](state) {
		return state.nuxtHydrated;
	},
	[IS_FETCH_PENDING](state) {
		return state.nuxtFetchPending;
	},
};
