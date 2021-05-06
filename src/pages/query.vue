<template>
	<splitpanes
		id="QueryMultipanes"
		class="py-0 pr-4"
		:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		horizontal
		:push-other-panes="true"
		@resize="onResize({
			examples: $event[0],
			output: $event[1],
		})"
	>
		<pane
			:size.sync="sizes.examples"
			:min-size="getConstraints.examples.minSize"
			:max-size="getConstraints.examples.maxSize"
		>
			<splitpanes
				:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
				:push-other-panes="true"
				:horizontal="mobile"
				@resize="onResize({
					tables: $event[0],
					query: $event[1],
				})"
			>
				<pane
					v-if="!mobile"
					:size.sync="sizes.tables"
					:min-size="getConstraints.tables.minSize"
					:max-size="getConstraints.tables.maxSize"
				>
					<LazyQueryTables
						:pending="isFetchPending"
						@update:start="updateTables(false)"
						@update:end="updateTables(true)"
					/>
				</pane>
				<pane
					:size.sync="sizes.query"
					:min-size="getConstraints.query.minSize"
					:max-size="getConstraints.query.maxSize"
				>
					<LazyQueryInput />
				</pane>
			</splitpanes>
		</pane>
		<pane
			:size="sizes.output"
			:min-size="getConstraints.output.minSize"
			:max-size="getConstraints.output.maxSize"
		>
			<LazyQueryOutput
				:sizes="sizes.output"
			/>
		</pane>
	</splitpanes>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LayoutMixin from '@/mixins/LayoutMixin';
import {
	VIEW_MODULE,
	SET_PANE_SIZES,
	SET_FETCH_PENDING,
	MOBILE,
	PANE_SIZES,
	IS_FETCH_PENDING,
} from '@/store/view/constants';
import {
	DATABASE_MODULE,
	FETCH_TABLES,
} from '@/store/database/constants';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default {
	name: 'Query',
	layout: 'default',
	components: {
		Splitpanes,
		Pane,
	},
	mixins: [
		LayoutMixin,
	],
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			sizes: PANE_SIZES,
			isFetchPending: IS_FETCH_PENDING,
		}),
		getConstraints () {
			if (this.mobile) {
				return {
					examples: { minSize: 100, maxSize: 100 },
					tables: { minSize: 100, maxSize: 100 },
					query: { minSize: 100, maxSize: 100 },
					output: { minSize: 100, maxSize: 100 },
				};
			}
			else {
				return {
					examples: { minSize: 0, maxSize: 100 },
					tables: { minSize: 20, maxSize: 100 },
					query: { minSize: 40, maxSize: 100 },
					output: { minSize: 0, maxSize: 100 },
				};
			}
		},
	},
	watch: {
		mobile (newVal) {
			if (newVal) {
				this.setPaneSizes({
					examples: 100,
					tables: 1,
					query: 100,
					output: 20,
				});
			}
			else {
				this.setPaneSizes({
					examples: 67,
					tables: 25,
					query: 75,
					output: 33,
				});
			}
		},
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setPaneSizes: SET_PANE_SIZES,
			setFetchPending: SET_FETCH_PENDING,
		}),
		...mapActions(DATABASE_MODULE, {
			fetchTables: FETCH_TABLES,
		}),
		onResize(data) {
			if (data) {
				const { examples, tables, query, output } = data;
				this.setPaneSizes({
					examples: examples ? examples.size : undefined,
					tables: tables ? tables.size : undefined,
					query: query ? query.size : undefined,
					output: output ? output.size : undefined,
				});
			}
		},
		async updateTables (finished = false) {
			if (finished) {
				await this.fetchTables();
			}
			this.setFetchPending(finished);
		},
	},
	head() {
		return {
			title: 'dashboard - immudb webconsole',
		};
	},
};
</script>

<style lang="scss">
#QueryMultipanes {
	height: 100% !important;
	max-height: 100% !important;
	padding: 0 $spacer-3 0 0;
	margin: 0;

	&.theme-- {
		&light {
			background-color: #fff !important;

			.v-card__text {
				box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.25);
			}

			.splitpanes__splitter {
				background-color: #fff;

				&:hover,
				&:active {
					background-color: #dfe6ed;
				}

				&::before {
					background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="%2321222c" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"></path></svg>');
				}
			}
		}

		&dark {
			background-color: #21222c !important;

			.v-card__text {
				box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.25);
			}

			.splitpanes__splitter {
				&:hover,
				&:active {
					background-color: #45475b;
				}

				&::before {
					background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="%23F5F5F5" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"></path></svg>');
				}
			}
		}
	}

	@media (max-width: 480px) {
		height: auto !important;
		max-height: unset !important;
		padding: 0 $spacer-3;
	}

	&.splitpanes {
		background-color: inherit;

		.splitpanes__splitter {
			min-height: 16px;
			min-width: 16px;
			position: relative;

			&:hover,
			&:active {
				&::before {
					opacity: 1;
				}
			}

			&::before {
				content: '';
				position: absolute;
				height: 16px;
				width: 16px;
				left: 50% !important;
				top: 0 !important;
				background-size: cover;
				background-repeat: no-repeat;
				text-align: center;
				transform: translateY(0%) translateX(-50%) rotate(-90deg);
				opacity: 0.35;
				z-index: 1;
			}
		}

		.splitpanes--vertical {
			> .splitpanes__splitter {
				&::before {
					top: calc(50% + 33px - 8px) !important;
					left: 0 !important;
					transform: translateY(-50%) translateX(0%) rotate(0deg) !important;
				}
			}
		}
	}
}
</style>
