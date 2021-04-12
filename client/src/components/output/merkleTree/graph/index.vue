<template>
	<span
		class="body-2"
	>
		<OutputMerkleTreeGraphMetrics
			id="MerkleTreeGraphMetrics"
			:metrics="metrics"
			:warning-threshold="warningThreshold"
		/>
		<OutputMerkleTreeGraphCommands
			id="MerkleTreeGraphCommands"
			@resetZoom="onResetZoom"
			@export="onExport"
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
				:duration="getDuration"
				node-text="label"
				:min-zoom="0.3"
				:max-zoom="9"
				:margin-y="getMargin.y"
				:margin-x="getMargin.x"
				:radius="10"
				:stroke-width="4"
				zoomable
				@clickedNode="onNodeClicked"
			>
				<template
					#node="{ data, node: {depth}, radius }"
				>
					<circle
						class="d3-circle"
						:class="`d3-${ data.children && data.children.length
							? depth === 0
								? 'root'
								: 'node'
							: 'leaf'
						} theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
						:r="radius"
					>
						<title>
							{{ data.data.htree }}
						</title>
					</circle>
					<text
						class="d3-text"
						:class="`d3-${ data.children && data.children.length
							? depth === 0
								? 'root'
								: 'node'
							: 'leaf'
						} theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
						:text="`${ data.label }`"
						:label="`${ data.label }`"
					/>
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
		warningThreshold: { type: Number, default: 64 },
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
			const { size } = this.metrics || { size: 16 };

			return {
				y: size * -2,
				x: size * -8,
			};
		},
		getDuration () {
			const { size } = this.metrics || { size: this.warningThreshold + 1 };

			return size > 64 ? 30 : 300;
		},
	},
	watch: {
		metrics: {
			deep: true,
			handler (newVal) {
				if (newVal) {
					const { size } = newVal;

					if (size > this.warningThreshold) {
						this.$toasted.info(this.$t('output.merkleTree.warning.title'), {
							duration: 5000,
						});
					}
				}
			},
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
		onExport () {
			try {
				// const { merkleTree } = this.$refs;
				// console.log(merkleTree);
			}
			catch (err) {
				console.error(err);
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
	#MerkleTreeGraphMetrics,
	#MerkleTreeGraphCommands {
		z-index: 10;
	}

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
		.d3-circle {
			&.d3- {
				&root,
				&node,
				&leaf {
					stroke: none !important;
				}

				&root {
					fill: #1976d2 !important;
				}

				&node {
					fill: #999 !important;
				}

				&leaf {
					fill: #4caf50 !important;
				}
			}
		}

		.d3-text {
			&.d3- {
				&root,
				&node,
				&leaf {
					stroke: none !important;
					text-shadow: none !important;
					font-size: 0.875rem !important;
					font-weight: 700;

					&.theme--dark {
						fill: #f1f1f1 !important;
					}

					&.theme--light {
						fill: #111 !important;
					}
				}

				&root {
					font-size: 1rem !important;
					transform:
						rotate(270deg)
						translate(0, -$spacer-2) !important;
				}

				&node {
					transform:
						rotate(270deg)
						translate($spacer-2, $spacer-12) !important;
				}

				&leaf {
					transform:
						rotate(0deg)
						translate($spacer-4, $spacer-1) !important;
				}
			}
		}
	}
}
</style>
