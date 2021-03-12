<template>
	<v-card
		id="NavigationExamples"
		class="ma-0 pa-0 bg fill-height shadow"
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
			/>
		</v-card-title>
		<v-card-text class="ma-0 py-1 px-0 bg-secondary">
			<v-treeview
				v-if="itemsLoaded"
				:open.sync="open"
				:items="items"
				item-key="id"
				open-on-click
				hoverable
			>
				<template
					slot="label"
					slot-scope="props"
				>
					<nuxt-link
						v-if="props.item.to"
						class="ma-0 pa-0"
						:class="{
							'nuxt-link-exact-active': forceActive(props.item.sort),
						}"
						:to="props.item.to"
					>
						{{ props.item.name }}
					</nuxt-link>
					<span
						v-else
					>
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
			open: ['0', '0-0'],
			items: [
				{
					id: '0',
					sort: 0,
					name: this.$t('navigation.examples.title'),
					children: [],
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
	mounted () {
		this.$nextTick(() => this.updateOpen());
	},
	methods: {
		parseExamples (data, parentId = 0) {
			if (data) {
				const { label, mime } = this.activeLanguage;
				return data
						.slice()
						.sort((a, b) => a.sort <= b.sort ? -1 : 1)
						.map((_) => {
							const { id, sort, title, children, fileName } = _;
							const isParent = children && children.length;
							return {
								id: `${ parentId }-${ id }`,
								sort,
								name: title,
								isParent,
								children: this.parseExamples(children, `${ parentId }-${ id }`),
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
		updateOpen () {
			const { query } = this.$route;
			if (query) {
				const { code } = query;
				this.open = code ? this.searchOpen(this.items, code) : ['0', '0-0'];
			}
		},
		searchOpen (data, code) {
			return data.reduce((acc, _) => {
				const { id, to, children } = _;
				if (to && to.query && to.query.code === code) {
					acc = [...acc, id];
				}
				if (children) {
					const childSearch = this.searchOpen(children, code);
					if (childSearch && childSearch.length) {
						acc = [...acc, id, ...childSearch];
					}
				}
				return acc;
			}, []);
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
		.v-treeview-node__root {
			min-height: $spacer-8;

			.v-treeview-node__level {
				display: none !important;
			}
		}

		.v-treeview-node__children {
			position: relative;
			padding-left: $spacer-5;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				left: calc(#{$spacer-5} - 1px);
				width: 2px;
				background-color: rgba(255, 255, 255, 0.25);
			}

			.v-treeview-node__content {
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
						padding: 0 $spacer-2 0 0 !important;

						&.nuxt-link-exact-active {
							color: white !important;

							&::before {
								content: '';
								position: absolute;
								top: 0;
								bottom: 0;
								left: -1px;
								width: 2px;
								background-color: $primary;
							}

							&::after {
								content: '';
								position: absolute;
								top: 0;
								right: 0;
								bottom: 0;
								left: 0;
								background-color: rgba(25, 119, 210, 0.15) !important;
							}
						}
					}
				}
			}
		}
	}
}
</style>
