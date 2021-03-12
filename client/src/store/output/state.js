import {
	DEFAULT_MERKLE_TREE_MODE,
} from './constants';

export default () => ({
	merkleTree: {
		json: [],
		graph: {},
		size: 0,
	},
	merkleTreeMode: DEFAULT_MERKLE_TREE_MODE,
	immudb: '',
	output: [],
	codeHistory: [],
});
