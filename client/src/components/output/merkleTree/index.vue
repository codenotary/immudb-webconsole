<template>
	<div
		id="OutputMerkleTree"
		ref="merkleTreeWrapper"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="(graph && graph.length) || (json && json.length)"
			class="ma-4 pa-0 pb-0"
		>
			<OutputMerkleTreeSelector
				id="MerkleTreeSelector"
				:graph="merkleTreeMode"
				@update="setMerkleTreeMode"
			/>
			<OutputMerkleTreeGraph
				v-if="merkleTreeMode === DEFAULT_MERKLE_TREE_MODE"
				:graph="graph"
				:metrics="metrics"
				:size="size"
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
			wrapperHeight: 600,
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			merkleTree: MERKLE_TREE,
			merkleTreeMode: MERKLE_TREE_MODE,
		}),
		graph () {
			if (this.merkleTree) {
				const { graph } = this.merkleTree;
				return graph;
			}
			return {};
		},
		metrics () {
			if (this.merkleTree) {
				const { metrics } = this.merkleTree;
				return metrics;
			}
			return {};
		},
		json () {
			if (this.merkleTree) {
				const { json } = this.merkleTree;
				return json;
			}
			return [];
		},
		size () {
			if (this.merkleTree) {
				const { size } = this.merkleTree;
				return size;
			}
			return 0;
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
	height: calc(100% - 32px) !important;

	#merkleTree {
		max-height: 100%;
	}

	#MerkleTreeSelector {
		position: absolute;
		top: $spacer-2;
		right: $spacer-2;
	}
}
</style>
