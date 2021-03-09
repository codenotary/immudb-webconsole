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
			<no-ssr
				v-if="merkleTreeMode === DEFAULT_MERKLE_TREE_MODE"
			>
				<tree
					id="merkleTree"
					ref="merkleTree"
					:data="tree"
					type="cluster"
					layout-type="vertical"
					node-text-display="all"
					link-layout="bezier"
					:duration="300"
					node-text="name"
					:radius="20"
					:stroke-width="6"
					zoomable
				>
					<template
						#node="{
							data,
							node: {depth},
							radius,
							isRetracted,
						}"
					>
						<template v-if="data.children && data.children.length">
							<path
								:fill="isRetracted ? 'red' : 'blue'"
								d="M190.5.."
							>
								<title>
									A: {{ data.text }} {{ depth }}
								</title>
							</path>
						</template>
						<template v-else>
							<circle
								:r="radius"
								:stroke="true ? 'blue' : 'yellow'"
							>
								<title>
									B: {{ data.text }} {{ depth }}
								</title>
							</circle>
						</template>
					</template>
				</tree>
			</no-ssr>
			<span
				v-else
				class="body-2"
			>
				<vue-json-pretty
					:data="merkleTree"
					:deep="3"
					:virtual="true"
					:show-line="true"
					:collapsed-on-click-brackets="true"
				/>
			</span>
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
import NoSSR from 'vue-no-ssr';
import { tree } from 'vued3tree';

export default {
	name: 'OutputMerkleTree',
	components: {
		tree,
		'no-ssr': NoSSR,
	},
	props: {
		merkleTree: { type: Array, default: () => {} },
		emptyMessage: { type: String, default: 'output.merkleTree.empty' },
	},
	data() {
		return {
			DEFAULT_MERKLE_TREE_MODE,
			tree: {
				name: 'father',
				children: [
					{
						name: 'son1',
						children: [
							{ name: 'grandson' },
							{ name: 'grandson2' },
						],
					},
					{
						name: 'son2',
						children: [
							{ name: 'grandson3' },
							{ name: 'grandson4' },
						],
					},
				],
			},
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
