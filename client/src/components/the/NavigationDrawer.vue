<template>
	<v-navigation-drawer
		id="TheNavigationDrawer"
		class="ma-0 pa-0 bg justify-space-between align-center"
		:class="{ mobile, mini }"
		:value="!collapsed"
		:permanent="!mobile"
		:mini-variant="mini && !mobile"
		:width="224"
		:mini-variant-width="64"
		:disable-resize-watcher="true"
		:hide-overlay="!mobile"
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
					color="grey darken-2"
				>
					{{ mdiMenu }}
				</v-icon>
			</v-btn>
		</div>
		<v-btn
			v-else
			class="ma-0 pa-0 d-flex justify-start align-center no-hover no-active"
			:to="localePath({ name: 'index' })"
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

		<NavigationExamples
			v-if="mobile"
		/>

		<v-list
			v-if="!mobile"
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
							v-bind="attrs"
							v-on="on"
						>
							<v-icon
								class="ma-0 mr-4 body-2 "
								color="grey darken-2"
								:class="{
									'mr-sm-0': mini,
									'mr-sm-4': !mini,
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
									class="body-2 grey--text text--darken-3"
								>
									{{ $t(item.title) }}
								</span>
								<span
									v-if="item.subtitle"
									class="caption grey--text"
								>
									{{ $t(item.subtitle) }}
								</span>
							</div>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t(item.title) }}
						<span v-if="item.subtitle">
							&nbsp;-&nbsp;{{ $t(item.subtitle) }}
						</span>
					</span>
				</v-tooltip>
			</div>
		</v-list>
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
	mdiXml,
	mdiBookOpenOutline,
	mdiChartBoxOutline,
	mdiCloudDownloadOutline,
} from '@mdi/js';

export default {
	name: 'TheNavigationDrawer',
	data() {
		return {
			mdiMenu,
			mdiXml,
			mdiBookOpenOutline,
			mdiChartBoxOutline,
			mdiCloudDownloadOutline,
			items: [],
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
					icon: mdiXml,
					to: this.localePath({ path: '/?code=/python/hello_world' }),
					hidden: false,
				},
				{
					title: 'sidebar.documentation',
					icon: mdiBookOpenOutline,
					href: 'https://docs.immudb.io/master',
					hidden: true,
				},
				{
					title: 'sidebar.analytics',
					icon: mdiChartBoxOutline,
					to: this.localePath({ path: '/analytics' }),
					hidden: true,
				},
				{
					title: 'sidebar.download',
					icon: mdiCloudDownloadOutline,
					href: 'https://github.com/codenotary/immudb-py',
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
		color: map-get($grey, lighten-6);
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
				color: white !important;
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
