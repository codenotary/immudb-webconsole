import {
	SET_DOCKER_TOKEN,
} from './constants';

export default {
	[SET_DOCKER_TOKEN](state, payload) {
		console.log(payload);
		state.dockerToken = payload;
	},
};
