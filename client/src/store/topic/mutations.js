import calculateId from '@/helpers/calculateId';
import {
	SET_TOPICS,
	SET_ACTIVE_TOPIC,
} from './constants';

export default {
	[SET_TOPICS](state, payload) {
		const { topics } = payload;
		const parseTopics = (data, parentLabel = null) => {
			return data && data.reduce((acc, _, idx) => {
				const e = _;
				const id = calculateId(parentLabel, _.label);
				const isParent = e.children && e.children.length > 0;

				e.id = id;
				e.children && (e.children = parseTopics(e.children, id));
				e.isParent = isParent;
				e.type = isParent
					? 'node'
					: e.code
						? 'code'
						: 'guide';
				e.to = isParent
					? undefined
					: {
						path: '/',
						query: { id },
					};
				return [...acc, e];
			}, []);
		};

		topics && (state.topics = parseTopics(topics));
	},
	[SET_ACTIVE_TOPIC](state, payload) {
		const { activePath } = payload;
		if (activePath) {
			const _path = activePath.startsWith('/') ? activePath : `/${ activePath }`;
			_path && (state.activeTopic = _path);
		}
	},
};
