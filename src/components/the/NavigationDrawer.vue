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
			to="/"
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
					:open-delay="300"
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
			<ProfileMenu
				@profile="profileOpen = true"
			/>

			<ProfileModal
				v-model="profileOpen"
				@submit="onProfile"
			/>
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
	mdiMenu,
	mdiDatabaseSearchOutline,
	mdiChartBoxOutline,
	mdiDatabaseCogOutline,
	mdiAccountCogOutline,
	mdiCogOutline,
	mdiBookOpenOutline,
} from '@mdi/js';

export default {
	name: 'TheNavigationDrawer',
	data() {
		return {
			mdiMenu,
			mdiDatabaseSearchOutline,
			mdiDatabaseCogOutline,
			mdiChartBoxOutline,
			mdiAccountCogOutline,
			mdiCogOutline,
			mdiBookOpenOutline,
			items: [],
			profileOpen: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			collapsed: SIDEBAR_COLLAPSED,
			mini: SIDEBAR_MINI,
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
					tooltip: 'sidebar.dashboard',
					icon: mdiChartBoxOutline,
					to: this.localePath({ path: '/' }),
					alt: 'Analytics',
				},
				{
					title: 'sidebar.query',
					tooltip: 'sidebar.query',
					icon: mdiDatabaseSearchOutline,
					to: this.localePath({ path: '/query' }),
					alt: 'Dashboard',
				},
				{
					title: 'sidebar.databases',
					tooltip: 'sidebar.databases',
					icon: mdiDatabaseCogOutline,
					to: this.localePath({ path: '/databases' }),
					alt: 'Databases',
				},
				{
					title: 'sidebar.users',
					tooltip: 'users.title',
					icon: mdiAccountCogOutline,
					to: this.localePath({ path: '/users' }),
					alt: 'Users',
				},
				{
					title: 'sidebar.settings',
					tooltip: 'sidebar.settings',
					icon: mdiCogOutline,
					to: this.localePath({ path: '/settings' }),
					alt: 'Settings',
					disabled: true,
				},
				{
					title: 'sidebar.guide',
					tooltip: 'sidebar.guide',
					icon: mdiBookOpenOutline,
					to: this.localePath({ path: '/guide' }),
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
		onMini () {
			this.setSidebar({ mini: !this.mini });
		},
		onCollapse () {
			this.setSidebar({
				collapsed: !this.collapsed,
			});
		},
		onProfile (data) {
			console.log(data);
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

		&.theme-- {
			&light {
				&:hover {
					background: map-get($blue, dark) !important;
					color: #e6e6e6 !important;

					svg {
						color: #e6e6e6 !important;
					}
				}
			}

			&dark {
				&:hover {
					background: map-get($blue, light) !important;
					color: #e6e6e6 !important;

					svg {
						color: #e6e6e6 !important;
					}
				}
			}
		}
	}
}
</style>
