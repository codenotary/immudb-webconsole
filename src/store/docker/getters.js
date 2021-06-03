import {
	DOCKER_TOKEN,
} from './constants';

export default {
	[DOCKER_TOKEN](state) {
		return state.dockerToken;
	},
};
