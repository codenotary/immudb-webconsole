import {
	DEFAULT_MERKLE_TREE_MODE,
} from './constants';

export default () => ({
	merkleTree: {
		json: [],
		graph: {},
		metrics: {
			size: 0,
			verified: false,
		},
	},
	height: 600,
	merkleTreeMode: DEFAULT_MERKLE_TREE_MODE,
	immudb: '',
	token: '',
	output: [],
	codeHistory: [],
});
