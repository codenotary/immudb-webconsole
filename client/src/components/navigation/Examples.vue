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
				:items="languages"
				hide-details
				dense
			/>
		</v-card-title>
		<v-card-text class="ma-0 py-1 px-0 bg-secondary">
			<v-treeview
				v-if="itemsLoaded"
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
			<NavigationSkeleton
				v-else
				class="ma-0 pa-4"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	EXAMPLE_MODULE,
	LANGUAGES,
	ACTIVE_LANGUAGE,
	EXAMPLES,
	ACTIVE_EXAMPLE,
} from '@/store/example/constants';
import {
	mdiViewList,
} from '@mdi/js';

export default {
	name: 'NavigationExamples',
	data () {
		return {
			mdiViewList,
			language: 'python',
			tree: [],
			initiallyOpen: [1],
			items: [
				{
					id: 1,
					name: this.$t('navigation.examples.title'),
					children: [],
				},
				{
					id: 2,
					name: this.$t('navigation.reference.title'),
					children: [
						{
							id: 1,
							name: 'Set',
							href: '',
						},
						{
							id: 2,
							name: 'Get',
							href: '',
						},
						{
							id: 3,
							name: 'VerifiedGet',
							href: '',
						},
						{
							id: 4,
							name: 'VerifiedSet',
							href: '',
						},
					],
				},
			],
		};
	},
	computed: {
		...mapGetters(EXAMPLE_MODULE, {
			languages: LANGUAGES,
			activeLanguage: ACTIVE_LANGUAGE,
			examples: EXAMPLES,
			activeExample: ACTIVE_EXAMPLE,
		}),
		itemsLoaded () {
			if (this.items && this.items[0]) {
				const { children } = this.items[0];
				return children && children.length > 0;
			}
			return false;
		},
	},
	watch: {
		examples: {
			deep: true,
			immediate: true,
			handler (newVal) {
				const children = this.parseExamples(newVal);
				if (children && children.length) {
					this.items[0].children = children;
				}
			},
		},
	},
	methods: {
		parseExamples (data) {
			if (data) {
				const { label, mime } = this.activeLanguage;
				return data
						.slice()
						.sort((a, b) => a.sort <= b.sort ? -1 : 1)
						.map((_) => {
							const { id, sort, title, children, fileName } = _;
							const isParent = children && children.length;
							return {
								id,
								sort,
								name: title,
								isParent,
								children: this.parseExamples(children),
								to: !isParent
									? {
										path: '/',
										query: {
											code: `/${ label }/${ fileName }.${ mime }`,
										},
									}
									: undefined,
							};
						});
			}
			return [];
		},
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
