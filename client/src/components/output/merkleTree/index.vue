<template>
	<div
		id="OutputMerkleTree"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="(graph && graph.length) || (json && json.length)"
			class="ma-4 pa-0 pb-8"
		>
			<OutputMerkleTreeSelector
				id="MerkleTreeSelector"
				:graph="merkleTreeMode"
				@update="setMerkleTreeMode"
			/>
			<OutputMerkleTreeGraph
				v-if="merkleTreeMode === DEFAULT_MERKLE_TREE_MODE"
				:graph="graph"
			/>
			<OutputMerkleTreeJson
				v-else
				:json="json"
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
	MERKLE_TREE,
	MERKLE_TREE_MODE,
	DEFAULT_MERKLE_TREE_MODE,
} from '@/store/output/constants';

export default {
	name: 'OutputMerkleTree',
	props: {
		emptyMessage: { type: String, default: 'output.merkleTree.empty' },
	},
	data() {
		return {
			DEFAULT_MERKLE_TREE_MODE,
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			merkleTree: MERKLE_TREE,
			merkleTreeMode: MERKLE_TREE_MODE,
		}),
		graph () {
			if (this.merkleTree) {
				return this.merkleTree.graph;
			}
			return [];
		},
		json () {
			if (this.merkleTree) {
				return this.merkleTree.json;
			}
			return [];
		},
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
