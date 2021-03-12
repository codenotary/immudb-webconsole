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
				type="cluster"
				layout-type="vertical"
				node-text-display="all"
				link-layout="bezier"
				:duration="300"
				node-text="label"
				:node-text-margin="32"
				:min-zoom="0.3"
				:max-zoom="9"
				:margin-y="10"
				:margin-x="10"
				:radius="10"
				:stroke-width="4"
				zoomable
			>
				<template
					#node="{ data, node: {depth}, radius }"
				>
					<template v-if="data.children && data.children.length">
						<circle
							:r="radius"
						>
							<title>
								A: {{ data.text }} {{ depth }}
							</title>
						</circle>
					</template>
					<template v-else>
						<circle
							:r="radius"
							fill="green"
						>
							<title>
								B: {{ data.text }} {{ depth }}
							</title>
						</circle>
					</template>
				</template>
				<template #popUp="{ data, node }">
					<OutputMerkleTreeGraphModal
						:item="data"
						:node="node"
					/>
				</template>
				<template #behavior="{ on, actions }">
					<popUpOnClickText v-bind="{ on, actions }" />
				</template>
			</tree>
		</no-ssr>
	</span>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { tree, popUpOnClickText } from 'vued3tree';

export default {
	name: 'OutputMerkleTreeGraph',
	components: {
		tree,
		popUpOnClickText,
		'no-ssr': NoSSR,
	},
	props: {
		graph: { type: Object, default: () => {} },
		size: { type: Number, default: 1 },
	},
	computed: {
		getMargin () {
			return this.size * 20;
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
