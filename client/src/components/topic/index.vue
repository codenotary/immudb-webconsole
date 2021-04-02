<template>
	<v-card
		id="Topic"
		class="ma-0 pa-0 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiFormatListBulletedType }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('topic.title') }}
			</h4>
			<!-- O: {{ open }} -->
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<v-treeview
				v-if="itemsLoaded"
				class="pt-3"
				:open.sync="open"
				:items="items"
				item-key="id"
				open-on-click
				hoverable
				:multiple-active="false"
			>
				<template
					slot="label"
					slot-scope="props"
				>
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon
								v-if="props.item.type !== 'node'"
								class="ma-0 mt-2 mr-2 pa-0"
								:class="{
									'primary--text text--darken-0': !$vuetify.theme.dark,
									'primary--text text--lighten-2': $vuetify.theme.dark,
								}"
								small
								v-bind="attrs"
								v-on="on"
							>
								{{ props.item.type === 'guide'
									? mdiBookOpenOutline
									: mdiXml
								}}
							</v-icon>
						</template>
						<span>
							{{ props.item.type }}
						</span>
					</v-tooltip>
					<nuxt-link
						v-if="props.item.to"
						class="ma-0 pa-0"
						:to="props.item.to"
					>
						{{ props.item.label }}
					</nuxt-link>
					<span
						v-else
					>
						{{ props.item.label }}
					</span>
				</template>
			</v-treeview>
			<TopicSkeleton
				v-else
				class="ma-0 pa-4"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	TOPIC_MODULE,
	TOPICS,
	ACTIVE_TOPIC,
} from '@/store/topic/constants';
import {
	CODE_MODULE,
	LANGUAGES,
	ACTIVE_LANGUAGE,
} from '@/store/code/constants';
import {
	mdiFormatListBulletedType,
	mdiBookOpenOutline,
	mdiXml,
} from '@mdi/js';

export default {
	name: 'Topic',
	data () {
		return {
			mdiFormatListBulletedType,
			mdiBookOpenOutline,
			mdiXml,
			language: 'python',
			open: [],
			items: [],
		};
	},
	computed: {
		...mapGetters(TOPIC_MODULE, {
			topics: TOPICS,
			activeTopic: ACTIVE_TOPIC,
		}),
		...mapGetters(CODE_MODULE, {
			languages: LANGUAGES,
			activeLanguage: ACTIVE_LANGUAGE,
		}),
		itemsLoaded () {
			if (this.items) {
				if (this.items.length > 0) {
					return true;
				}
				else if (this.items[0]) {
					const { children } = this.items[0];
					return children && children.length > 0;
				}
			}
			return false;
		},
	},
	watch: {
		topics: {
			deep: true,
			immediate: true,
			handler (newVal) {
				if (newVal) {
					const children = this.parseTopics(newVal);
					if (children && children.length) {
						this.items = children;
						this.initOpen();
					}
				}
			},
		},
	},
	methods: {
		parseTopics (data) {
			if (data) {
				return data
						.slice()
						.sort((a, b) => a.sort <= b.sort ? -1 : 1);
			}
			return [];
		},
		searchOpen (data, code) {
			try {
				return data && data.reduce((acc, _) => {
					const { id, to, children } = _;
					if (to && to.query && to.query.code === code) {
						acc = [...acc, id];
					}
					if (children && children.length > 0) {
						const childSearch = this.searchOpen(children, code);
						if (childSearch && childSearch.length) {
							acc = [...acc, id, ...childSearch];
						}
					}
					return acc;
				}, []);
			}
			catch (err) {
				console.error(err);
			}
		},
		initOpen () {
			const { query: { topic } } = this.$route;
			this.$nextTick(() => {
				topic.split('/')
						.slice(0, -1)
						.map((_, idx) => {
							const prev = topic
									.split('/')
									.slice(0, idx)
									.join('/')
									.replace(/ /g, '');
							this.open.push(`/guides/${ prev }${ prev && '/' }${ _ }/index`);
						});
			});
		},
		forceActive (data) {
			const { path, query: { id } } = this.$route;
			return data === 0 && path === '/' && !id;
		},
	},
};
</script>

<style lang="scss">
#Topic {
	&.v-card {
		.v-card__title {
			height: 44px !important;

			@media (max-width: 480px) {
				height: 32px !important;
			}
		}

		.v-card__text {
			height: calc(100% - 44px) !important;
		}

		@media (max-width: 480px) {
			height: auto !important;
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
		&.theme-- {
			&light {
				.v-treeview-node__label {
					a {
						color: #191919 !important;

						&.nuxt-link-exact-active {
							color: #191919 !important;
						}

						&::before {
							background-color: $primary;
						}

						&::after {
							background-color: rgba(25, 119, 210, 0.15) !important;
						}
					}
				}

				.v-treeview-node__children {
					&::before {
						background-color: rgba(0, 0, 0, 0.25);
					}
				}
			}

			&dark {
				.v-treeview-node__label {
					a {
						color: #e6e6e6 !important;

						&.nuxt-link-exact-active {
							color: #e6e6e6 !important;
						}

						&::before {
							background-color: $primary;
						}

						&::after {
							background-color: rgba(25, 119, 210, 0.15) !important;
						}
					}
				}

				.v-treeview-node__children {
					&::before {
						background-color: rgba(255, 255, 255, 0.25);
					}
				}
			}
		}

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
			}
		}

		.v-treeview-node__content {
			.v-treeview-node__label {
				display: flex;
				height: 100%;
				width: 100%;
				font-size: 0.8rem;

				a {
					display: flex;
					flex-grow: 1;
					justify-content: flex-start;
					align-items: center;
					min-height: $spacer-8;
					padding: 0 $spacer-2 0 0 !important;

					&.nuxt-link-exact-active {
						&::before {
							content: '';
							position: absolute;
							top: 0;
							bottom: 0;
							left: -1px;
							width: 2px;
						}

						&::after {
							content: '';
							position: absolute;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
						}
					}
				}
			}
		}
	}
}
</style>
