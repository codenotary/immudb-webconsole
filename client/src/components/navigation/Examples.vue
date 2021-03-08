<template>
	<v-card
		id="NavigationExamples"
		class="ma-0 pt-0 pb-1 px-1 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-2 px-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2 title gray--text text--lighten-3"
			>
				{{ mdiViewList }}
			</v-icon>
			<v-select
				v-if="false"
				v-model="language"
				class="language-selector"
				:items="languageItems"
				hide-details
				dense
			/>
			<h4 class="ml-2 subtitle-1 gray--text text--lighten-3">
				{{ $t('examples.title') }}
			</h4>
		</v-card-title>
		<v-card-text class="ma-0 py-1 px-0 bg-secondary">
			<v-treeview
				v-model="tree"
				:open="initiallyOpen"
				class="ml-0"
				:items="items"
				item-key="id"
				open-on-click
			>
				<template #prepend="{ item }">
					<v-icon
						v-if="item.children && item.icon"
						small
						v-text="item.icon"
					/>
				</template>
				<template slot="label" slot-scope="props">
					<nuxt-link
						v-if="props.item.to"
						class="ma-0 pa-4"
						:class="{
							'nuxt-link-exact-active': forceActive(props.item.sort),
						}"
						:to="props.item.to"
					>
						{{ props.item.name }}
					</nuxt-link>
					<span v-else>
						{{ props.item.name }}
					</span>
				</template>
			</v-treeview>
		</v-card-text>
	</v-card>
</template>

<script>
import {
	mdiViewList,
} from '@mdi/js';

export default {
	name: 'NavigationExamples',
	data () {
		return {
			mdiViewList,
			language: 'python',
			languageItems: [
				'python',
				'node',
				'go',
				'java',
			],
			tree: [],
			initiallyOpen: [1],
			items: [
				{
					id: 1,
					name: 'Python',
					children: [
						{
							id: 201,
							name: 'Hello world',
							sort: 0,
							to: {
								path: '/',
								query: {
									code: '/python/hello_world',
								},
							},
						},
						{
							id: 202,
							name: 'Massive operations',
							sort: 1,
							to: {
								path: '/',
								query: {
									code: '/python/massive_operations',
								},
							},
						},
						{
							id: 203,
							name: 'Money',
							sort: 2,
							to: {
								path: '/',
								query: {
									code: '/python/money',
								},
							},
						},
						{
							id: 204,
							name: 'Parallel massive operations',
							sort: 3,
							to: {
								path: '/',
								query: {
									code: '/python/parallel_massive_operations',
								},
							},
						},
						{
							id: 205,
							name: 'Safe operations',
							sort: 4,
							to: {
								path: '/',
								query: {
									code: '/python/safe_operations',
								},
							},
						},
					],
				},
			],
		};
	},
	methods: {
		forceActive (data) {
			const { path, query } = this.$route;
			return data === 0 && path === '/' && !query.code;
		},
	},
};
</script>

<style lang="scss">
#NavigationExamples {
	&.v-card {
		@media (max-width: 480px) {
			height: auto !important;
		}

		.v-card__text {
			height: calc(100% - 44px) !important;
		}
	}

	.language-selector {
		width: auto !important;
		min-width: unset !important;
		max-width: unset !important;

		.v-input__slot {
			&::before {
				display: none;
			}
		}
	}

	.v-treeview {
		.v-treeview-node__level {
			display: none !important;
		}

		.v-treeview-node__root {
			.v-treeview-node__content {
				.v-treeview-node__prepend {
					display: none !important;
				}
			}
		}

		.v-treeview-node__children {
			position: relative;

			.v-treeview-node__root {
				min-height: $spacer-8;
				margin: 0;
				padding: 0;

				&:hover,
				&:active {
					background-color: rgba(255, 255, 255, 0.05);
				}
			}

			.v-treeview-node__content {
				margin: 0;

				.v-treeview-node__label {
					height: 100%;
					width: 100%;
					font-size: 0.8rem;

					span,
					a {
						color: #e6e6e6 !important;
					}

					a {
						display: flex;
						flex-grow: 1;
						justify-content: flex-start;
						align-items: center;
						min-height: $spacer-8;
						padding: 0 $spacer-1 0 $spacer-8 !important;

						&.nuxt-link-exact-active {
							color: $primary !important;

							&::before {
								content: '';
								position: absolute;
								top: 0;
								bottom: $spacer-1;
								left: calc(#{$spacer-5} - 1px);
								width: 2px;
								background-color: $primary;
							}
						}
					}
				}
			}

			&::before {
				content: '';
				position: absolute;
				top: 0;
				bottom: $spacer-1;
				left: calc(#{$spacer-5} - 1px);
				width: 2px;
				background-color: rgba(255, 255, 255, 0.25);
			}
		}
	}
}
</style>
