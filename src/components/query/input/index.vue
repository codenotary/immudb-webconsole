<template>
	<v-card
		id="QueryInput"
		class="ma-0 pa-0 bg fill-height pane shadow-pane"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-end align-center">
			<v-icon
				:class="{
					'gray--text text--darken-3': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
			>
				{{ mdiDatabaseSearchOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-3': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
			>
				{{ $t('query.input.title') }}
			</h4>
			<v-spacer />
			<QueryInputActionSelectSnapshot
				@update="onSnapshotUpdate"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<QueryInputActionRun
				:query="query"
				:number-of-queries="numberOfQueries"
				@submit="onSubmit"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-terminal custom-scrollbar"
		>
			<div class="ma-0 pa-0 fill-height">
				<QueryInputBlock
					:key="id"
					class="ma-0 pa-0 fill-height"
					:query.sync="query"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';
import {
	IMMUDB_MODULE,
	SET_TX,
	RUN_SQL_QUERY,
	RUN_SQL_EXEC,
} from '@/store/immudb/constants';
import {
	OUTPUT_MODULE,
	RESET_OUTPUT,
} from '@/store/output/constants';
import sqlParser from '@/helpers/sqlParser';
import {
	mdiDatabaseSearchOutline,
} from '@mdi/js';

const uniqueId = require('lodash.uniqueid');
const TRANSACTION_LABEL = 'begin transaction';

export default {
	name: 'QueryInput',
	data () {
		return {
			mdiDatabaseSearchOutline,
			id: 0,
			query: '',
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			loading: IS_LOADING,
		}),
		splittedQueries () {
			if (!this.query) {
				return [''];
			}
			if (this.query
					.toLowerCase()
					.includes(TRANSACTION_LABEL)
			) {
				return [
					{
						sql: this.query.replace(/\r?\n|\r/g, ' '),
						type: sqlParser(this.query),
					},
				];
			}
			return this.query
					.split(';')
					.filter((_) => {
						return _ && _
								.replace(/ /g, '')
								.replace(/\r?\n|\r/g, '');
					})
					.map((_) => {
						return {
							sql: _.replace(/\r?\n|\r/g, ' '),
							type: sqlParser(_),
						};
					});
		},
		numberOfQueries () {
			return this.splittedQueries &&
				this.splittedQueries.length;
		},
	},
	watch: {
		activeQuery: {
			immediate: true,
			deep: true,
			handler (newVal) {
				if (newVal && newVal !== this.query) {
					this.query = newVal;
					this.id = uniqueId('id_');
				}
			},
		},
	},
	mounted() {
		this._keyListener = function(e) {
			if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				if (!this.isLoading) {
					this.onSubmit();
				}
			}
		};

		document.addEventListener('keydown', this._keyListener.bind(this));
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this._keyListener);
	},
	methods: {
		...mapActions(IMMUDB_MODULE, {
			runSqlQuery: RUN_SQL_QUERY,
			runSqlExec: RUN_SQL_EXEC,
			setTx: SET_TX,
		}),
		...mapActions(OUTPUT_MODULE, {
			resetOutput: RESET_OUTPUT,
		}),
		onUpdate (data) {
			try {
				if (data) {
					this.query = data;
				}
			}
			catch (err) {
				console.error(err);
			}
		},
		onSubmitonReset () {
			this.resetOutput();
			this.query = '';
			this.showToastInfo(this.$t('query.cleared'));
		},
		onSnapshotUpdate (data) {
			// TODO restore those api calls after the time travel feature is released
			// this.setTx(data);
			// this.runSqlExec(`USE SNAPSHOT SINCE TX ${ data } BEFORE TX ${ data }`);
		},
		onSubmit () {
			this.$emit('submit', this.splittedQueries);
		},
	},
};
</script>
