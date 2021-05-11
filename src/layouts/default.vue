<template>
	<v-app id="default-layout">
		<TheNavigationDrawer />
		<TheAppBar
			v-if="mobile"
			class="ma-0 pa-0"
		/>
		<v-main class="ma-0 pa-0 pt-12 pt-sm-0 pl-sm-16 bg">
			<nuxt />
		</v-main>
		<TheFooter />

		<!-- MODALS -->
		<UiModalAuth
			v-model="authModalOpen"
			@close="onLogin"
			@submit="onLogin"
		/>
	</v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_THEME,
	SET_FETCH_PENDING,
	MOBILE,
} from '@/store/view/constants';
import {
	AUTH_MODULE,
	LOGIN,
	TOKEN,
} from '@/store/auth/constants';
import {
	DATABASE_MODULE,
	FETCH_DATABASE_LIST,
	FETCH_TABLES,
	SET_ACTIVE_DATABASE,
	SET_TABLE_LIST,
	USE_DATABASE,
	ACTIVE_DATABASE,
} from '@/store/database/constants';
import {
	IMMUDB_MODULE,
	FETCH_HEALTH,
	FETCH_STATE,
	RUN_SQL_EXEC,
	STATE,
} from '@/store/immudb/constants';
import LayoutMixin from '@/mixins/LayoutMixin';

let IMMUDB_POLLING_ID = null;
const IMMUDB_POLLING_INTERVAL = 10000;

export default {
	name: 'DefaultLayout',
	mixins: [
		LayoutMixin,
	],
	data () {
		return {
			authModalOpen: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
		...mapGetters(AUTH_MODULE, {
			token: TOKEN,
		}),
		...mapGetters(DATABASE_MODULE, {
			activeDatabase: ACTIVE_DATABASE,
		}),
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
		}),
	},
	watch: {
		token: {
			deep: true,
			immediate: true,
			handler (newVal) {
				if (newVal) {
					this.onInit(true);
				}
				else {
					this.authModalOpen = true;
				}
			},
		},
	},
	beforeDestroy () {
		this.stopPolling();
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setTheme: SET_THEME,
			setFetchPending: SET_FETCH_PENDING,
		}),
		...mapActions(AUTH_MODULE, {
			immudbLogin: LOGIN,
		}),
		...mapActions(DATABASE_MODULE, {
			fetchDatabaseList: FETCH_DATABASE_LIST,
			fetchTables: FETCH_TABLES,
			setActiveDatabase: SET_ACTIVE_DATABASE,
			setTableList: SET_TABLE_LIST,
			useDatabase: USE_DATABASE,
		}),
		...mapActions(IMMUDB_MODULE, {
			fetchHealth: FETCH_HEALTH,
			fetchState: FETCH_STATE,
			runSqlExec: RUN_SQL_EXEC,
		}),
		_setTheme (data) {
			if (data) {
				data && this.setTheme(data);
				this.$vuetify.theme.dark = data === 'dark';
				setTimeout(() => {
					this.$vuetify.theme.dark = data === 'dark';
				}, 0);
			}
		},
		async onInit (useDatabase = true) {
			try {
				this.setFetchPending(true);
				useDatabase && await this.useDatabase(this.activeDatabase);
				await this.fetchHealth();
				await this.fetchState();
				const { txId } = this.state;
				if (txId) {
					await this.runSqlExec(`USE SNAPSHOT SINCE TX ${ txId } BEFORE TX ${ txId }`);
					await this.fetchDatabaseList();
					await this.fetchTables();
				}
				else {
					this.setTableList({ tables: [] });
				}
				this.setFetchPending(false);

				// Fetch immudb state every 10 seconds
				this.startPolling();
			}
			catch (err) {
				console.error(err);
				this.setFetchPending(false);
				this.showToastError(err);
			}
		},
		async onLogin (data) {
			try {
				data && await this.immudbLogin(data);
			}
			catch (err) {
				this.showToastError(err);
				setTimeout(() => {
					this.authModalOpen = true;
				}, 30);
			}
		},
		async updateTables (finished = false) {
			try {
				if (finished) {
					await this.fetchTables();
					this.$fetchState.pending = false;
				}
				else {
					this.$fetchState.pending = true;
				}
			}
			catch (err) {
				console.error(err);
			}
		},
		startPolling () {
			try {
				if (IMMUDB_POLLING_INTERVAL) {
					this.stopPolling();
					IMMUDB_POLLING_ID = setInterval(async () => {
						await this.fetchState();
					}, IMMUDB_POLLING_INTERVAL);
				}
				else {
					this.stopPolling();
				}
			}
			catch (err) {
				console.error(err);
				this.stopPolling();
			}
		},
		stopPolling () {
			try {
				clearInterval(IMMUDB_POLLING_ID);
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
</script>

<style lang="scss">
	.v-main {
		max-height: calc(100vh - #{$spacer-11});

		@media (max-width: 480px) {
			height: auto !important;
			max-height: unset !important;
		}
	}

	.v-content {
		transition: none !important;
	}
</style>
