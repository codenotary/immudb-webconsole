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
	IMMUDB_MODULE,
	LOGIN,
	FETCH_HEALTH,
	FETCH_STATE,
	FETCH_TABLES,
	RUN_SQL_EXEC,
	SET_STATE,
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
	async fetch () {
		try {
			this.setFetchPending(true);
			await this.immudbLogin({
				user: 'immudb',
				password: 'immudb',
			});
			await this.fetchHealth();
			await this.fetchState();
			const { txId } = this.state;
			if (txId) {
				await this.setState(this.state);
				await this.runSqlExec(`USE SNAPSHOT SINCE TX ${ txId } BEFORE TX ${ txId }`);
			}
			await this.fetchTables();
			this.setFetchPending(false);
		}
		catch (err) {
			console.error(err);
			this.setFetchPending(false);
		}
	},
	fetchOnServer: false,
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
		}),
	},
	mounted() {
		// Fetch immudb state every 10 seconds
		this.startPolling();
	},
	beforeDestroy () {
		this.stopPolling();
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setTheme: SET_THEME,
			setFetchPending: SET_FETCH_PENDING,
		}),
		...mapActions(IMMUDB_MODULE, {
			immudbLogin: LOGIN,
			fetchHealth: FETCH_HEALTH,
			fetchState: FETCH_STATE,
			setState: SET_STATE,
			runSqlExec: RUN_SQL_EXEC,
			fetchTables: FETCH_TABLES,
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
		async updateTables (finished = false) {
			if (finished) {
				await this.fetchTables();
				this.$fetchState.pending = false;
			}
			else {
				this.$fetchState.pending = true;
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
