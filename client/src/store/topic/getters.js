import deepFind from '@/helpers/deepFind';
import {
	TOPICS,
	ACTIVE_TOPIC,
} from './constants';

export default {
	[TOPICS](state) {
		return state.topics || [];
	},
	[ACTIVE_TOPIC](state) {
		return deepFind(state.topics, 'id', 'children', state.activeTopic);
	},
};
