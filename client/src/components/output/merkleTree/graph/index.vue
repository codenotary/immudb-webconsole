<template>
	<span
		class="body-2"
	>
		<OutputMerkleTreeGraphCommands
			id="MerkleTreeGraphCommands"
			@resetZoom="onResetZoom"
		/>
		<no-ssr>
			<tree
				id="merkleTree"
				ref="merkleTree"
				:identifier="getId"
				:data="graph"
				type="tree"
				layout-type="vertical"
				node-text-display="all"
				link-layout="bezier"
				:duration="300"
				node-text="id"
				:min-zoom="0.3"
				:max-zoom="9"
				:radius="20"
				:stroke-width="6"
				zoomable
			>
				<!-- <template
					#node="{ data, node: {depth}, radius, isRetracted }"
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
				</template> -->
			</tree>
		</no-ssr>
	</span>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { tree } from 'vued3tree';

export default {
	name: 'OutputMerkleTreeGraph',
	components: {
		tree,
		'no-ssr': NoSSR,
	},
	props: {
		graph: { type: Object, default: () => {} },
	},
	watch: {
		graph (newVal) {
			console.log(newVal);
		},
	},
	methods: {
		getId () {
			return this._uid;
		},
		onResetZoom () {
			if (this.$refs.merkleTree) {
				this.$refs.merkleTree.resetZoom();
			}
		},
	},
};
</script>

<style lang="scss">
#OutputMerkleTree {
	#MerkleTreeGraphCommands {
		position: absolute;
		top: $spacer-15;
		left: $spacer-4;
	}
}
</style>
