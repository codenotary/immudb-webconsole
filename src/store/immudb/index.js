import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export * from './constants';
export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters,
};
