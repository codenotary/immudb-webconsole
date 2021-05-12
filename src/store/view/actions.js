import {
	SET_SPLASH,
	SET_THEME,
	TOGGLE_THEME,
	SET_MOBILE,
	SET_BANNER,
	SET_SIDEBAR,
	SET_BREADCRUMBS,
	ADD_BREADCRUMBS,
	POP_LOADING,
	PUSH_LOADING,
	SET_PANE_SIZES,
	SET_TIMEZONE,
	SET_HIDE_DISABLED,
	SET_NUXT_HYDRATED,
	SET_FETCH_PENDING,
} from './constants';

export default {
	[SET_SPLASH]({ commit }, payload) {
		commit(SET_SPLASH, payload);
	},
	[SET_THEME]({ commit }, payload) {
		commit(SET_THEME, payload);
	},
	[TOGGLE_THEME]({ commit }) {
		commit(TOGGLE_THEME);
	},
	[SET_MOBILE]({ commit }, payload) {
		commit(SET_MOBILE, payload);
	},
	[SET_BANNER]({ commit }, payload) {
		commit(SET_BANNER, payload);
	},
	[SET_SIDEBAR]({ commit }, payload) {
		commit(SET_SIDEBAR, payload);
	},
	[SET_BREADCRUMBS]({ commit }, payload) {
		commit(SET_BREADCRUMBS, payload);
	},
	[ADD_BREADCRUMBS]({ commit }, payload) {
		commit(ADD_BREADCRUMBS, payload);
	},
	[PUSH_LOADING]({ commit }, payload) {
		commit(PUSH_LOADING, payload);
	},
	[POP_LOADING]({ commit }, payload) {
		commit(POP_LOADING, payload);
	},
	[SET_PANE_SIZES]({ commit }, payload) {
		commit(SET_PANE_SIZES, payload);
	},
	[SET_TIMEZONE]({ commit }, payload) {
		commit(SET_TIMEZONE, payload);
	},
	[SET_HIDE_DISABLED]({ commit }, payload) {
		commit(SET_HIDE_DISABLED, payload);
	},
	[SET_NUXT_HYDRATED]({ commit }, payload) {
		commit(SET_NUXT_HYDRATED, payload);
	},
	[SET_FETCH_PENDING]({ commit }, payload) {
		commit(SET_FETCH_PENDING, payload);
	},
};
