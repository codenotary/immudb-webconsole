import {
	SET_TOPICS,
	SET_ACTIVE_TOPIC,
} from './constants';

export default {
	[SET_TOPICS](state, payload) {
		const { topics } = payload;
		const parseTopics = (data) => {
			return data && data.reduce((acc, _) => {
				const e = _;
				const isParent = e.children && e.children.length > 0;
				e.id = e.path;
				e.children && (e.children = parseTopics(e.children));
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
						query: {
							topic: e.path.replace(/\/guides\//, ''),
							code: _.code,
							live: _.live,
						},
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
