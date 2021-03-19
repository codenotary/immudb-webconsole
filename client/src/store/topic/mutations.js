import {
	SET_TOPICS,
	SET_ACTIVE_TOPIC,
} from './constants';

export default {
	[SET_TOPICS](state, payload) {
		const { topics } = payload;

		const addIdx = (data, parentId = null) => {
			return data && data.reduce((acc, _, idx) => {
				const e = _;
				e.id = idx;
				e.children && (e.children = addIdx(e.children, idx));
				return [...acc, e];
			}, []);
		};

		topics && (state.topics = addIdx(topics));
	},
	[SET_ACTIVE_TOPIC](state, payload) {
		const { activePath } = payload;
		if (activePath) {
			const _path = activePath.startsWith('/') ? activePath : `/${ activePath }`;
			_path && (state.activeTopic = _path);
		}
	},
};
