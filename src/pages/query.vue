<template>
	<splitpanes
		id="QueryMultipanes"
		class="ma-0 pa-0 pr-4"
		:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		:horizontal="mobile"
		:push-other-panes="true"
		@resize="onResize({
			tables: $event[0],
			examples: $event[1],
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
				@update:use="onUseDatabase"
			/>
		</pane>
		<pane
			:size.sync="sizes.examples"
			:min-size="getConstraints.examples.minSize"
			:max-size="getConstraints.examples.maxSize"
		>
			<splitpanes
				:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
				horizontal
				:push-other-panes="true"
				@resize="onResize({
					query: $event[0],
					output: $event[1],
				})"
			>
				<pane
					:size.sync="sizes.query"
					:min-size="getConstraints.query.minSize"
					:max-size="getConstraints.query.maxSize"
				>
					<LazyQueryInput
						@submit="onRunQuery"
					/>
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
	SPLASH,
	PUSH_LOADING,
	POP_LOADING,
	MOBILE,
	PANE_SIZES,
	IS_FETCH_PENDING,
} from '@/store/view/constants';
import {
	DATABASE_MODULE,
	FETCH_DATABASE_LIST,
	FETCH_TABLES,
	SET_ACTIVE_DATABASE,
	ADD_DATABASE,
	USE_DATABASE,
	ACTIVE_DATABASE,
} from '@/store/database/constants';
import {
	IMMUDB_MODULE,
	FETCH_STATE,
	RUN_SQL_QUERY,
	RUN_SQL_EXEC,
	RUN_SQL_TYPE,
} from '@/store/immudb/constants';
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
		...mapGetters(DATABASE_MODULE, {
			activeDatabase: ACTIVE_DATABASE,
		}),
		getConstraints () {
			if (this.mobile) {
				return {
					tables: { minSize: 100, maxSize: 100 },
					examples: { minSize: 100, maxSize: 100 },
					query: { minSize: 100, maxSize: 100 },
					output: { minSize: 100, maxSize: 100 },
				};
			}
			else {
				return {
					tables: { minSize: 25, maxSize: 100 },
					examples: { minSize: 60, maxSize: 100 },
					query: { minSize: 20, maxSize: 100 },
					output: { minSize: 20, maxSize: 100 },
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
	mounted () {
		// track google analytics pageview
		process.env.IS_PUBLIC_DEMO && this.$gtag.pageview({
			page_title: 'Query',
			page_location: window && window.location && window.location.href,
			page_path: '/query',
		});
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setPaneSizes: SET_PANE_SIZES,
			setFetchPending: SET_FETCH_PENDING,
			splash: SPLASH,
			pushLoading: PUSH_LOADING,
			popLoading: POP_LOADING,
		}),
		...mapActions(DATABASE_MODULE, {
			fetchDatabaseList: FETCH_DATABASE_LIST,
			fetchTables: FETCH_TABLES,
			setActiveDatabase: SET_ACTIVE_DATABASE,
			addDatabase: ADD_DATABASE,
			useDatabase: USE_DATABASE,
		}),
		...mapActions(IMMUDB_MODULE, {
			fetchState: FETCH_STATE,
			runSqlQuery: RUN_SQL_QUERY,
			runSqlExec: RUN_SQL_EXEC,
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
			this.setFetchPending(!finished);
		},
		async onUseDatabase (data) {
			try {
				if (data !== this.activeDatabase) {
					await this.setActiveDatabase({ active: data });
					await this.useDatabase(data);
				}
				await this.fetchDatabaseList();
				if (!this.splash) {
					this.$toasted.success(this.$t('databases.table.action.use.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				console.error(err);
				this.showToastError(err);
			}
		},
		async onRunQuery (data) {
			const BATCH_LABEL = 'onRunQuery';
			try {
				this.pushLoading({
					label: 'onRunQuery',
					silently: true,
				});
				await data.map((_, idx) => {
					const { sql, type } = _;
					setTimeout(async () => {
						try {
							if (type === RUN_SQL_TYPE.QUERY) {
								await this.runSqlQuery(sql);
							}
							else {
								await this.runSqlExec(sql);
								this.showToastSuccess('query.input.run.command');
							}
							if (idx === data.length - 1) {
								this.popLoading({ label: BATCH_LABEL });
								await this.fetchTables(true);
							}

							// updated txID
							await this.fetchState(true);
						}
						catch (err) {
							console.error(err);
							this.showToastError(err);
							this.popLoading({ label: BATCH_LABEL });
						}
					}, 300 * idx);
				});
			}
			catch (err) {
				console.error(err);
				this.popLoading({ label: BATCH_LABEL });
			}
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

			.splitpanes__splitter {
				background-color: #fff;

				&:hover,
				&:active {
					background-color: #d5dfe6;
				}

				&::before {
					background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="%0d3049" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"></path></svg>');
				}
			}
		}

		&dark {
			background-color: #153954 !important;

			.splitpanes__splitter {
				&:hover,
				&:active {
					background-color: #4d708a;
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

		&.splitpanes--vertical {
			> .splitpanes__splitter {
				&::before {
					top: calc(50% - 8px) !important;
					left: 0 !important;
					transform: translateY(-50%) translateX(0%) rotate(0deg) !important;
				}
			}
		}
	}
}
</style>
