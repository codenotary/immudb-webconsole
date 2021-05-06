<template>
	<v-navigation-drawer
		id="TheNavigationDrawer"
		class="ma-0 pa-0 bg d-flex justify-space-between align-center"
		:class="{ mobile, mini }"
		:value="!collapsed"
		:permanent="!mobile"
		:mini-variant="mini && !mobile"
		:width="224"
		:mini-variant-width="64"
		:disable-resize-watcher="true"
		:elevation="0"
		floating
		app
	>
		<!-- LOGO -->
		<div
			v-if="mobile"
			class="d-flex justify-center align-center"
		>
			<v-btn
				class="d-flex justify-center align-center no-hover no-active"
				:width="48"
				:ripple="false"
				depressed
				icon
				@click="onCollapse"
			>
				<v-icon
					class="headline"
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiMenu }}
				</v-icon>
			</v-btn>
		</div>
		<v-btn
			v-else
			class="ma-0 pa-0 d-flex justify-start align-center no-hover no-active"
			href="https://www.codenotary.com"
			target="_blank"
			rel="noopener"
			:ripple="false"
			:min-height="44"
			:width="mini ? 64 : 214"
			:min-width="mini ? 64 : 214"
			depressed
			text
			nuxt
		>
			<TheLogo
				class="no-transation"
				:class-name="`d-flex justify-${ mini ? 'center' : 'start' } align-center fill-width`"
				align="center"
				:size="mini ? 'small' : 'small'"
				:mini="mini"
			/>
		</v-btn>

		<v-list
			class="px-0 pt-16 pt-sm-4 ma-0 custom-scrollbar"
		>
			<div
				v-for="(item, idx) in items"
				:key="`drawer-item-${ idx }`"
				class="ma-0 pa-0"
			>
				<v-tooltip
					v-if="item && !item.hidden"
					:disabled="!mini"
					right
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							class="py-1 d-flex justify-xs-center"
							:to="item.to ? item.to : undefined"
							:href="undefined"
							:ripple="true"
							nuxt
							:title="item.alt"
							:alt="item.alt"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon
								class="ma-0 mr-4 body-2"
								:class="{
									'mr-sm-0': mini,
									'mr-sm-4': !mini,
									'gray--text text--darken-1': !item.disabled && !$vuetify.theme.dark,
									'gray--text text--lighten-1': !item.disabled && $vuetify.theme.dark,
									'gray--text text--lighten-3': item.disabled && !$vuetify.theme.dark,
									'gray--text text--darken-3': item.disabled && $vuetify.theme.dark,
								}"
							>
								{{ item.icon }}
							</v-icon>
							<template slot="body">
								{{ $t(item.title) }}
							</template>
							<div
								v-if="!mini"
								class="ma-0 pa-0 d-flex flex-column justify-center align-start"
							>
								<span
									v-if="item.title"
									class="body-2"
									:class="{
										'gray--text text--darken-1': !$vuetify.theme.dark,
										'gray--text text--lighten-1': $vuetify.theme.dark,
									}"
								>
									{{ $t(item.title) }}
								</span>
								<span
									v-if="item.subtitle"
									class="caption"
									:class="{
										'gray--text text--darken-3': !$vuetify.theme.dark,
										'gray--text text--lighten-3': $vuetify.theme.dark,
									}"
								>
									{{ $t(item.subtitle) }}
								</span>
							</div>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t(item.tooltip) }}
					</span>
				</v-tooltip>
			</div>
		</v-list>
		<template #append>
			<div class="ma-0 pa-0 pb-12">
				<v-tooltip
					v-if="isAuthenticated"
					right
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							class="py-1 d-flex justify-center"
							:ripple="true"
							:title="$t('sidebar.logout.alt')"
							:alt="$t('sidebar.logout.alt')"
							v-bind="attrs"
							v-on="on"
							@click="onLogout"
						>
							<v-icon
								class="ma-0 body-2 text-center"
								:class="{
									'gray--text text--darken-1': !$vuetify.theme.dark,
									'gray--text text--lighten-1': $vuetify.theme.dark,
								}"
							>
								{{ mdiLogout }}
							</v-icon>
							<div
								class="ma-0 pa-0 d-flex flex-column justify-center align-start"
							>
								<span
									class="body-2"
									:class="{
										'gray--text text--darken-1': !$vuetify.theme.dark,
										'gray--text text--lighten-1': $vuetify.theme.dark,
									}"
								>
									{{ $t('sidebar.logout.alt') }}
								</span>
							</div>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('sidebar.logout.alt') }}
					</span>
				</v-tooltip>
			</div>
		</template>
	</v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_SIDEBAR,
	MOBILE,
	SIDEBAR_COLLAPSED,
	SIDEBAR_MINI,
} from '@/store/view/constants';
import {
	IMMUDB_MODULE,
	SET_TOKEN,
	AUTHENTICATED,
} from '@/store/immudb/constants';
import {
	mdiMenu,
	mdiDatabaseSearchOutline,
	mdiChartBoxOutline,
	mdiDatabaseCogOutline,
	mdiAccountMultipleOutline,
	mdiCogOutline,
	mdiBookOpenOutline,
	mdiLogout,
} from '@mdi/js';

export default {
	name: 'TheNavigationDrawer',
	data() {
		return {
			mdiMenu,
			mdiDatabaseSearchOutline,
			mdiDatabaseCogOutline,
			mdiChartBoxOutline,
			mdiAccountMultipleOutline,
			mdiCogOutline,
			mdiBookOpenOutline,
			mdiLogout,
			items: [],
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			collapsed: SIDEBAR_COLLAPSED,
			mini: SIDEBAR_MINI,
		}),
		...mapGetters(IMMUDB_MODULE, {
			isAuthenticated: AUTHENTICATED,
		}),
	},
	watch: {
		mobile: {
			immediate: true,
			handler (newVal) {
				newVal && this.onCollapse();
			},
		},
	},
	mounted () {
		this.$nextTick(() => {
			this.items = [
				{
					title: 'sidebar.dashboard',
					tooltip: 'common.comingSoon',
					icon: mdiChartBoxOutline,
					// to: this.localePath({ path: '/' }),
					alt: 'Analytics',
					disabled: true,
				},
				{
					title: 'sidebar.query',
					tooltip: 'sidebar.query',
					icon: mdiDatabaseSearchOutline,
					to: this.localePath({ path: '/query' }),
					alt: 'Dashboard',
					hidden: false,
				},
				{
					title: 'sidebar.databases',
					tooltip: 'common.comingSoon',
					icon: mdiDatabaseCogOutline,
					// to: this.localePath({ path: '/databases' }),
					alt: 'Databases',
					disabled: true,
				},
				{
					title: 'sidebar.users',
					tooltip: 'common.comingSoon',
					icon: mdiAccountMultipleOutline,
					// to: this.localePath({ path: '/users' }),
					alt: 'Users',
					disabled: true,
				},
				{
					title: 'sidebar.settings',
					tooltip: 'common.comingSoon',
					icon: mdiCogOutline,
					// to: this.localePath({ path: '/settings' }),
					alt: 'Settings',
					disabled: true,
				},
				{
					title: 'sidebar.guide',
					tooltip: 'common.comingSoon',
					icon: mdiBookOpenOutline,
					// to: this.localePath({ path: '/guide' }),
					alt: 'Guide',
					disabled: true,
				},
				{
					title: 'sidebar.documentation',
					tooltip: 'sidebar.documentation',
					icon: mdiBookOpenOutline,
					href: 'https://docs.immudb.io/master',
					alt: 'Documentation',
					hidden: true,
				},
			];
		});
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setSidebar: SET_SIDEBAR,
		}),
		...mapActions(IMMUDB_MODULE, {
			setToken: SET_TOKEN,
		}),
		onMini () {
			this.setSidebar({ mini: !this.mini });
		},
		onCollapse () {
			this.setSidebar({
				collapsed: !this.collapsed,
			});
		},
		onLogout () {
			this.setToken(null);
		},
	},
};
</script>

<style lang="scss">
#TheNavigationDrawer {
	.v-navigation-drawer__content,
	.v-navigation-drawer__append {
		width: 100%;
	}

	.v-list-item {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
		transition: background 0.3s ease, color 0.3s ease;

		&::before {
			content: '';
			position: absolute;
			top: 4px;
			bottom: 4px;
			height: 0;
			width: 4px;
			background-color: $primary;
			border-radius: 0 4px 4px 0;
			opacity: 1;
			transition: none;
		}

		&.v-list-item--active {
			svg,
			span {
				font-weight: 900;
			}

			&::before {
				height: calc(100% - 8px);
			}
		}

		&:hover {
			background: map-get($blue, dark) !important;
		}
	}
}
</style>
