import {
	SET_LANGUAGES,
	SET_ACTIVE_LANGUAGE,
	SET_EXAMPLES,
	SET_CODE,
	SET_ACTIVE_EXAMPLE,
} from './constants';
const objectPath = require('object-path');

export default {
	[SET_LANGUAGES](state, payload) {
		const { languages } = payload;
		languages && (state.languages = languages);
	},
	[SET_ACTIVE_LANGUAGE](state, payload) {
		const { language } = payload;
		language && (state.activeLanguage = language);
	},
	[SET_EXAMPLES](state, payload) {
		const { examples } = payload;

		const addIdx = (data, parentId = null) => {
			return data && data.reduce((acc, _, idx) => {
				const e = _;
				e.id = idx;
				e.children && (e.children = addIdx(e.children, idx));
				return [...acc, e];
			}, []);
		};

		examples && (state.examples = addIdx(examples));
	},
	[SET_CODE](state, payload) {
		const { id, code } = payload;
		objectPath.set(state.examples, `${ id }.code`, code);
	},
	[SET_ACTIVE_EXAMPLE](state, payload) {
		const { activePath } = payload;
		const _path = activePath.startsWith('/') ? activePath : `/${ activePath }`;
		_path && (state.activeExample = _path);
	},
};
