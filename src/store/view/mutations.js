import {
	SET_SPLASH,
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
	SET_TIMEZONE,
	SET_HIDE_NOT_ACTIVE,
	SET_NUXT_HYDRATED,
	SET_FETCH_PENDING,
} from './constants';

export default {
	[SET_SPLASH](state, payload) {
		state.splash = payload;
	},
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
		if (payload) {
			state.banner = payload;
		}
		else {
			state.banner = {
				show: false,
				title: '',
				color: '',
				persistent: false,
				subtitle: '',
			};
		}
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
		const { examples, tables, query, output } = payload;
		examples !== undefined && (state.paneSizes.examples = examples);
		tables !== undefined && (state.paneSizes.tables = tables);
		query !== undefined && (state.paneSizes.query = query);
		output !== undefined && (state.paneSizes.output = output);
	},
	[SET_TIMEZONE](state, payload) {
		state.timezone = payload;
	},
	[SET_HIDE_NOT_ACTIVE](state, payload) {
		state.hideNotActive = payload;
	},
	[SET_NUXT_HYDRATED](state, payload) {
		state.nuxtHydrated = payload;
	},
	[SET_FETCH_PENDING](state, payload) {
		state.nuxtFetchPending = payload;
	},
};
