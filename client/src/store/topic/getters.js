import {
	CODE_MODULE,
	ACTIVE_LANGUAGE,
	DEFAULT_LANGUAGE,
} from '@/store/code/constants';
import {
	TOPICS,
	ACTIVE_TOPIC,
} from './constants';

export default {
	[TOPICS](state) {
		return state.topics || [];
	},
	[ACTIVE_TOPIC](state, rootGetters) {
		const activeLanguage = rootGetters[`${ CODE_MODULE }/${ ACTIVE_LANGUAGE }`];
		const { label, mime } = activeLanguage || DEFAULT_LANGUAGE;
		let result = {};

		const recursiveGet = (data) => {
			data && data.map((_) => {
				const activePath = `/${ label }/${ _ && _.fileName }.${ mime }`;
				const { children } = _;
				const childSearch = children && recursiveGet(children);
				if (activePath === state.activeTopic || childSearch) {
					if (_ && activePath === state.activeTopic) {
						result = _;
					}
					else if (childSearch) {
						result = childSearch;
					}
				}
			});
		};

		recursiveGet(state.examples);
		return result;
	},
};
