import Vue from 'vue';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_TOPICS,
	SET_TOPICS,
	SET_ACTIVE_TOPIC,
} from './constants';

export default {
	async [FETCH_TOPICS]({ commit }, payload) {
		const LOADING_LABEL = 'fetchExamples';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			const topicsTree = await Vue.prototype.$workers
					.parseTopicsTree(payload, 'guides');
			commit(SET_TOPICS, { topics: topicsTree });
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
		catch (err) {
			console.error(err);
		}
	},
	[SET_TOPICS]({ commit }, payload) {
		commit(SET_TOPICS, payload);
	},
	[SET_ACTIVE_TOPIC]({ commit }, payload) {
		commit(SET_ACTIVE_TOPIC, payload);
	},
};
