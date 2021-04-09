<template>
	<span
		class="body-2"
	>
		<OutputMerkleTreeGraphMetrics
			id="MerkleTreeGraphMetrics"
			:metrics="metrics"
		/>
		<OutputMerkleTreeGraphCommands
			id="MerkleTreeGraphCommands"
			@resetZoom="onResetZoom"
		/>
		<no-ssr>
			<tree
				id="merkleTree"
				ref="merkleTree"
				:style="`height: ${ getHeight }px`"
				:identifier="getId"
				:data="graph"
				type="cluster"
				layout-type="vertical"
				node-text-display="all"
				link-layout="bezier"
				:duration="300"
				node-text="label"
				:min-zoom="0.3"
				:max-zoom="9"
				:margin-y="16"
				:margin-x="16"
				:radius="10"
				:stroke-width="4"
				zoomable
				@clickedNode="onNodeClicked"
			>
				<template
					#node="{ data, node: {depth}, radius }"
				>
					<template>
						<g
							:class="`d3-${ data.children && data.children.length
								? depth === 0
									? 'root'
									: 'node'
								: 'leaf'
							}`"
						>
							<circle
								class="d3-circle"
								:r="radius"
							>
								<title>
									{{ data.data.htree }}
								</title>
							</circle>
							<text
								class="d3-text"
								:text="`${ data.text } - ${ depth }`"
								:label="`${ data.text } - ${ depth }`"
							/>
						</g>
					</template>
				</template>
				<template #popUp="{ data, node }">
					<OutputMerkleTreeGraphPopUp
						:item="data"
						:node="node"
					/>
				</template>
				<template #behavior="{ on, actions }">
					<popUpOnHoverText v-bind="{ on, actions }" />
				</template>
			</tree>
			<OutputMerkleTreeGraphModal
				v-model="modal.show"
				:node="modal.node"
				:item="modal.data"
				@close="model.show = false"
			/>
		</no-ssr>
	</span>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	PANE_SIZES,
} from '@/store/view/constants';
import NoSSR from 'vue-no-ssr';
import { tree, popUpOnHoverText } from 'vued3tree';

export default {
	name: 'OutputMerkleTreeGraph',
	components: {
		tree,
		popUpOnHoverText,
		'no-ssr': NoSSR,
	},
	props: {
		graph: { type: Object, default: () => {} },
		metrics: { type: Object, default: () => {} },
		size: { type: Number, default: 1 },
	},
	data () {
		return {
			modal: {
				show: false,
				data: undefined,
				node: undefined,
			},
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			paneSizes: PANE_SIZES,
		}),
		getHeight () {
			const { innerHeight } = window;
			if (this.paneSizes) {
				const { output } = this.paneSizes;
				return (output / 100 * innerHeight) - 96;
			}
			return 600;
		},
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
		onNodeClicked (event) {
			if (event) {
				const { node, data } = event;
				this.modal = {
					show: true,
					node,
					data,
				};
			}
		},
	},
};
</script>

<style lang="scss">
#OutputMerkleTree {
	#MerkleTreeGraphMetrics {
		position: absolute;
		top: $spacer-15;
		left: $spacer-4;
	}

	#MerkleTreeGraphCommands {
		position: absolute;
		top: $spacer-15;
		right: $spacer-4;
	}

	g.node {
		g.d3- {
			&root,
			&node,
			&leaf {
				.d3-circle {
					stroke: none !important;
				}

				.d3-text {
					fill: white !important;
					stroke: none !important;
					font-size: 1rem !important;
					font-weight: 700 !important;
					text-shadow: none !important;
					text-anchor: middle !important;
				}
			}

			&root {
				.d3-circle {
					fill: #1976d2 !important;
				}

				.d3-text {
					transform:
						rotate(270deg)
						translate(0, -$spacer-2) !important;
				}
			}

			&node {
				.d3-circle {
					fill: #999 !important;
				}

				.d3-text {
					transform:
						rotate(270deg)
						translate($spacer-2, $spacer-12) !important;
				}
			}

			&leaf {
				.d3-circle {
					fill: #4caf50 !important;
				}

				.d3-text {
					transform:
						rotate(0deg)
						translate($spacer-12, $spacer-1) !important;
				}
			}
		}
	}
}
</style>
