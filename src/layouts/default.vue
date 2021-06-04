<template>
	<v-app
		id="DefaulLayout"
		class="bg"
		:class="{
			'active': active && bannerOpen,
		}"
	>
		<LazyTheBanner
			id="TheBanner"
			:value="bannerOpen"
			:title="banner.title"
			:persistent="banner.persistent"
			:color="banner.color"
			@mouseenter.native="bannerHover = true"
			@mouseleave.native="bannerHover = false"
			@submit="onSubmitBanner"
			@close="onCloseBanner"
		/>
		<LazyTheNavigationDrawer
			v-if="splashFinished"
		/>
		<LazyTheAppBar
			v-if="mobile && splashFinished"
			class="ma-0 pa-0"
		/>
		<v-main class="ma-0 pa-0 pt-12 pt-sm-0 pl-sm-16 bg">
			<nuxt
				v-show="splashFinished"
			/>
		</v-main>
		<LazyTheFooter
			v-if="splashFinished"
		/>

		<!-- MODALS -->
		<UiModalSplash
			:value="!splashFinished"
			:duration="SPLASH_DURATION"
			@submit="onLogin"
		/>
	</v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_SPLASH,
	SET_THEME,
	SET_FETCH_PENDING,
	SPLASH,
	MOBILE,
	BANNER,
} from '@/store/view/constants';
import {
	DOCKER_MODULE,
	FETCH_DOCKER_TOKEN,
	DOCKER_TOKEN,
} from '@/store/docker/constants';
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
	USER_MODULE,
	FETCH_USER_LIST,
} from '@/store/user/constants';
import {
	IMMUDB_MODULE,
	FETCH_HEALTH,
	FETCH_STATE,
	RUN_SQL_EXEC,
	STATE,
} from '@/store/immudb/constants';
import {
	METRICS_MODULE,
	FETCH_METRICS,
	PERIOD,
} from '@/store/metrics/constants';
import LayoutMixin from '@/mixins/LayoutMixin';

const SPLASH_DURATION = 1200;
let IMMUDB_POLLING_ID = null;
const IMMUDB_POLLING_INTERVAL = 10000;

let METRICS_POLLING_ID = null;

const ACTIVATION_DELAY = 3000;
const BANNER_COOKIE = 'bannerCookie';

export default {
	name: 'DefaultLayout',
	mixins: [
		LayoutMixin,
	],
	async fetch () {
		if (process.env.IS_PUBLIC_DEMO && !this.dockerToken) {
			await this.fetchDockerToken();
		}
		await this.fetchMetrics();
	},
	data () {
		return {
			SPLASH_DURATION,
			active: false,
			bannerOpen: false,
			bannerHover: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			splash: SPLASH,
			mobile: MOBILE,
			banner: BANNER,
		}),
		...mapGetters(DOCKER_MODULE, {
			dockerToken: DOCKER_TOKEN,
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
		...mapGetters(METRICS_MODULE, {
			METRICS_POLLING_INTERVAL: PERIOD,
		}),
		splashFinished () {
			return !this.splash;
		},
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
					this.setSplash(true);
				}
			},
		},
		banner: {
			deep: true,
			handler (newVal) {
				if (newVal) {
					const { show } = newVal;
					this.bannerOpen = show;
				}
				else {
					this.bannerOpen = false;
				}
			},
		},
	},
	mounted () {
		// fetch a second time after 3 seconds
		// to avoid having a one-point chart
		setTimeout(async () => {
			await this.fetchMetrics();
		}, 3000);

		// start polling for metrics
		this.startMetricsPolling();

		// check banenr cookie
		setTimeout(() => {
			if (!process.env.IS_PUBLIC_DEMO && !this.$cookies.get(BANNER_COOKIE)) {
				this.active = true;
			}
		}, ACTIVATION_DELAY);
	},
	beforeDestroy () {
		this.stopImmudbPolling();
		this.stopMetricsPolling();
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setSplash: SET_SPLASH,
			setTheme: SET_THEME,
			setFetchPending: SET_FETCH_PENDING,
		}),
		...mapActions(DOCKER_MODULE, {
			fetchDockerToken: FETCH_DOCKER_TOKEN,
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
		...mapActions(USER_MODULE, {
			fetchUserList: FETCH_USER_LIST,
		}),
		...mapActions(IMMUDB_MODULE, {
			fetchHealth: FETCH_HEALTH,
			fetchState: FETCH_STATE,
			runSqlExec: RUN_SQL_EXEC,
		}),
		...mapActions(METRICS_MODULE, {
			fetchMetrics: FETCH_METRICS,
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
				await this.fetchUserList();
				const { txId } = this.state;
				if (txId !== undefined) {
					await this.fetchDatabaseList();
					await this.fetchTables();
					// TODO restore those api calls after the time travel feature is released
					// try {
					// 	await this.runSqlExec(`USE SNAPSHOT SINCE TX ${ txId } BEFORE TX ${ txId }`);
					// }
					// catch (err) {
					// 	console.error(err);
					// }
				}
				else {
					this.setTableList({ tables: [] });
				}
				this.setFetchPending(false);

				// Fetch immudb state every 10 seconds
				this.startImmudbPolling();
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
				console.log('login timeout');
				this.setSplash(false);
			}
			catch (err) {
				this.showToastError(err);
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
		startImmudbPolling () {
			try {
				if (IMMUDB_POLLING_INTERVAL) {
					this.stopImmudbPolling();
					IMMUDB_POLLING_ID = setInterval(() => {
						this.fetchState();
					}, IMMUDB_POLLING_INTERVAL);
				}
				else {
					this.stopImmudbPolling();
				}
			}
			catch (err) {
				console.error(err);
				this.stopImmudbPolling();
			}
		},
		stopImmudbPolling () {
			try {
				clearInterval(IMMUDB_POLLING_ID);
			}
			catch (err) {
				console.error(err);
			}
		},
		startMetricsPolling () {
			try {
				if (this.METRICS_POLLING_INTERVAL) {
					this.stopMetricsPolling();
					METRICS_POLLING_ID = setInterval(() => {
						this.fetchMetrics();
					}, this.METRICS_POLLING_INTERVAL);
				}
				else {
					this.stopMetricsPolling();
				}
			}
			catch (err) {
				console.error(err);
				this.stopMetricsPolling();
			}
		},
		stopMetricsPolling () {
			try {
				clearInterval(METRICS_POLLING_ID);
			}
			catch (err) {
				console.error(err);
			}
		},
		onSubmitBanner () {
			this.bannerOpen = false;
			this.$cookies.set(BANNER_COOKIE, '7D');
		},
		onCloseBanner () {
			this.bannerOpen = false;
			this.$cookies.set(BANNER_COOKIE, '1D');
		},
	},
};
</script>

<style lang="scss">
#DefaulLayout {
	.v-system-bar {
		max-height: 0;
		transition: max-height 0.15s ease-out;
		overflow: hidden !important;
	}

	.v-navigation-drawer {
		top: 0;
	}

	.v-main {
		max-height: calc(100vh - #{$spacer-11});
		margin-top: $spacer-12;

		@media (max-width: 480px) {
			height: auto !important;
			max-height: unset !important;
		}
	}

	&.active {
		.v-system-bar {
			max-height: $spacer-6;
			transition: max-height 0.25s ease-in;
		}

		.v-navigation-drawer {
			top: $spacer-6 !important;
		}

		.v-main {
			padding-top: $spacer-6 !important;
		}
	}
}
</style>
