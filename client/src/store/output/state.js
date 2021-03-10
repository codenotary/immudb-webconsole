import {
	DEFAULT_MERKLE_TREE_MODE,
} from './constants';

export default () => ({
	merkleTree: {
		json: [],
		graph: [],
	},
	merkleTreeMode: DEFAULT_MERKLE_TREE_MODE,
	immudb: '',
	output: [],
	codeHistory: [],
});
