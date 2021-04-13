import {
	SET_THEME,
	TOGGLE_THEME,
	SET_MOBILE,
	SET_BANNER,
	SET_SIDEBAR,
	SET_BREADCRUMBS,
	ADD_BREADCRUMBS,
	POP_LOADING,
	PUSH_LOADING,
	SET_NUXT_HYDRATED,
	SET_PANE_SIZES,
} from './constants';

export default {
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
	[SET_NUXT_HYDRATED]({ commit }, payload) {
		commit(SET_NUXT_HYDRATED, payload);
	},
};
