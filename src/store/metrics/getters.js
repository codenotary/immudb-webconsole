import {
	DB_SIZE,
	MEMORY_USAGE,
	READ_AND_WRITE,
} from './constants';

export default {
	[DB_SIZE](state) {
		return state.dbSize || [];
	},
	[MEMORY_USAGE](state) {
		return state.memoryUsage || [];
	},
	[READ_AND_WRITE](state) {
		return state.readAndWrite || [];
	},
};
