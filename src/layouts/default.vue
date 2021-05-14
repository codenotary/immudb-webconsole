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

const SPLASH_DURATION = 1200;
let IMMUDB_POLLING_ID = null;
const IMMUDB_POLLING_INTERVAL = 10000;

const ACTIVATION_DELAY = 3000;
const BANNER_COOKIE = 'bannerCookie';

export default {
	name: 'DefaultLayout',
	mixins: [
		LayoutMixin,
	],
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
		...mapGetters(AUTH_MODULE, {
			token: TOKEN,
		}),
		...mapGetters(DATABASE_MODULE, {
			activeDatabase: ACTIVE_DATABASE,
		}),
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
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
		setTimeout(() => {
			if (!this.$cookies.get(BANNER_COOKIE)) {
				this.active = true;
			}
		}, ACTIVATION_DELAY);
	},
	beforeDestroy () {
		this.stopPolling();
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setSplash: SET_SPLASH,
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
					await this.fetchDatabaseList();
					await this.fetchTables();
					try {
						await this.runSqlExec(`USE SNAPSHOT SINCE TX ${ txId } BEFORE TX ${ txId }`);
					}
					catch (err) {
						console.error(err);
					}
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
		margin-top: 0;
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
			margin-top: $spacer-6 !important;
		}

		.v-main {
			padding-top: $spacer-6 !important;
		}
	}

	.v-content {
		transition: none !important;
	}
}
</style>
