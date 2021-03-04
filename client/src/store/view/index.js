import state from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export * from './constants';
export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters,
};
