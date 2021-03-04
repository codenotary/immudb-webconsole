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
	STORE_NUXT_HYDRATED,
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
	[SET_SIDEBAR](state, payload) {
		if (payload) {
			const { mini, collapsed } = payload;

			mini !== undefined && (state.sidebar.mini = mini);
			collapsed !== undefined && (state.sidebar.collapsed = collapsed);
		}
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
	[STORE_NUXT_HYDRATED]({ commit }, payload) {
		commit(STORE_NUXT_HYDRATED, payload);
	},
};
