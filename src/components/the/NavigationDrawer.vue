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
		:elevation="4"
		floating
		app
	>
		<span
			class="navigation-slider"
			:style="`top: ${ getSliderTop }px !important;`"
		/>
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
						'gray--text text--lighten-1': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
					}"
				>
					{{ mdiMenu }}
				</v-icon>
			</v-btn>
		</div>
		<v-btn
			v-else
			class="navigation-drawer-logo ma-2 mt-4 mb-0 pa-0 d-flex justify-center align-center no-hover no-active"
			to="/"
			:ripple="false"
			:min-height="64"
			:width="mini ? 48 : 214"
			:min-width="mini ? 48 : 214"
			depressed
			text
			nuxt
		>
			<TheLogo
				class="no-transation"
				:class-name="`d-flex justify-${ mini ? 'center' : 'start' } align-center fill-width`"
				align="center"
				:mini="mini"
			/>
			<UiLogoImmudb
				:height="14"
			/>
		</v-btn>

		<v-list
			class="px-0 pt-16 pt-sm-0 ma-0 custom-scrollbar"
		>
			<div
				v-for="(item, idx) in items"
				:key="`drawer-item-${ idx }`"
				class="ma-0 pa-0"
			>
				<v-tooltip
					v-if="item && !item.hidden"
					content-class="ma-0 py-2 px-4 bg primary-outlined arrow-left-center"
					:disabled="!mini"
					right
					:open-delay="300"
					:nudge-right="4"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							class="py-1 d-flex justify-xs-center no-ripple-hover"
							:to="item.to ? item.to : undefined"
							:href="undefined"
							:ripple="false"
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
									'gray--text text--lighten-1': !item.disabled && !$vuetify.theme.dark,
									'gray--text text--lighten-3': !item.disabled && $vuetify.theme.dark,
									'gray--text text--lighten-4': item.disabled && !$vuetify.theme.dark,
									'gray--text text--lighten-2': item.disabled && $vuetify.theme.dark,
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
										'gray--text text--lighten-1': !$vuetify.theme.dark,
										'gray--text text--lighten-4': $vuetify.theme.dark,
									}"
								>
									{{ $t(item.title) }}
								</span>
								<span
									v-if="item.subtitle"
									class="caption"
									:class="{
										'gray--text text--lighten-1': !$vuetify.theme.dark,
										'gray--text text--lighten-4': $vuetify.theme.dark,
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
			<ProfileMenu />
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
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			collapsed: SIDEBAR_COLLAPSED,
			mini: SIDEBAR_MINI,
		}),
		getSliderTop () {
			const idx = this.items.findIndex((_) => {
				const { to } = _;
				return to === this.$route.path;
			});
			return (56 * idx) + 84;
		},
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
			//
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

	.navigation-drawer-logo {
		.v-btn__content {
			flex-direction: column;
			max-width: 100%;
			max-height: 64px !important;
		}
	}

	.navigation-slider {
		position: absolute;
		top: 84px;
		left: 0;
		width: 4px;
		height: 48px;
		background-color: var(--v-primary-base);
		border-radius: 0 4px 4px 0;
		opacity: 1;
		transition: all ease-in 0.3s !important;
		z-index: 5;
	}

	.v-list-item {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
		transition: background 0.3s ease, color 0.3s ease;

		&.v-list-item--active {
			svg,
			span {
				font-weight: 900;
				color: var(--v-primary-base);
			}

			&::before {
				height: calc(100% - 8px);
			}
		}

		&.theme-- {
			&light {
				&:hover {
					&,
					svg {
						color: var(--v-primary-darken1) !important;
						fill: var(--v-primary-darken1) !important;
					}
				}
			}

			&dark {
				&:hover {
					&,
					svg {
						color: var(--v-primary-darken1) !important;
						fill: var(--v-primary-darken1) !important;
					}
				}
			}
		}
	}
}
</style>
