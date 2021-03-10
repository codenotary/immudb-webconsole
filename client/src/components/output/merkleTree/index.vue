<template>
	<div
		id="OutputMerkleTree"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="merkleTree && merkleTree.length"
			class="ma-4 pa-0 pb-8"
		>
			<OutputMerkleTreeSelector
				id="MerkleTreeSelector"
				:graph="merkleTreeMode"
				@update="setMerkleTreeMode"
			/>
			<OutputMerkleTreeGraph
				v-if="merkleTreeMode === DEFAULT_MERKLE_TREE_MODE"
				:merkle-tree="merkleTree"
			/>
			<OutputMerkleTreeJson
				v-else
				:merkle-tree="merkleTree"
			/>
		</div>
		<div
			v-else
			class="ma-4 pa-0"
		>
			<span class="body-2">
				{{ $t(emptyMessage) }}
			</span>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	OUTPUT_MODULE,
	SET_MERKLE_TREE_MODE,
	MERKLE_TREE_MODE,
	DEFAULT_MERKLE_TREE_MODE,
} from '@/store/output/constants';

export default {
	name: 'OutputMerkleTree',
	props: {
		merkleTree: { type: Array, default: () => {} },
		emptyMessage: { type: String, default: 'output.merkleTree.empty' },
	},
	data() {
		return {
			DEFAULT_MERKLE_TREE_MODE,
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			merkleTreeMode: MERKLE_TREE_MODE,
		}),
	},
	methods: {
		...mapActions(OUTPUT_MODULE, {
			setMerkleTreeMode: SET_MERKLE_TREE_MODE,
		}),
	},
};
</script>

<style lang="scss">
#OutputMerkleTree {
	#merkleTree {
		max-height: 100%;
		height: 600px;
	}

	#MerkleTreeSelector {
		position: absolute;
		top: $spacer-2;
		right: $spacer-2;
	}
}
</style>
