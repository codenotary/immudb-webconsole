<template>
	<v-menu
		v-if="isAuthenticated"
		class="ma-0 pa-0 d-flex flex-column justify-center align-center outlined"
		content-class="arrow-bottom-left primary-outlined"
		style="padding-bottom: 16px !important;"
		top
		offset-y
		:nudge-left="2"
		:nudge-top="12"
		open-on-hover
		:close-on-click="false"
		:close-on-content-click="false"
		close-delay="300"
	>
		<template #activator="{ on, attrs }">
			<v-list-item
				class="ma-0 mb-8 pa-0"
				v-bind="attrs"
				v-on="on"
			>
				<v-avatar
					color="primary elevation-2"
					:size="40"
				>
					<span
						class="ma-0 pa-0 white--text title text-uppercase font-weight-bold"
						style="padding-top: 1px !important;"
					>
						{{ userInitials }}
					</span>
				</v-avatar>
			</v-list-item>
		</template>
		<v-list
			class="ma-0 pa-0 bg rounded-1"
		>
			<v-list-item
				class="ma-0 pa-0 primary d-flex justify-center align-center fill-width"
				ripple
				style="border-radius: 4px 4px 0 0;"
				:title="$t('common.username')"
				:alt="$t('common.username')"
			>
				<v-list-item-content>
					<v-list-item-title
						class="ma-0 pa-0 bg--text text-center"
					>
						<span class="ma-0 pa-0 body-2">
							{{ $t('common.username') }}
						</span>
						<span class="ma-0 pa-0 body-2 font-weight-bold">
							{{ user }}
						</span>
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item
				class="pb-2 d-flex justify-start"
				ripple
				:title="$t('profile.themeToogle.alt')"
				:alt="$t('profile.themeToogle.alt')"
			>
				<ProfileTimezone />
			</v-list-item>
			<v-divider
				class="my-0 mx-4 pa-0 bg-secondary"
			/>
			<v-list-item
				class="d-flex justify-start"
				ripple
				:title="$t('profile.themeToogle.alt')"
				:alt="$t('profile.themeToogle.alt')"
				@click="onThemeToggle"
			>
				<v-icon
					class="ma-0 body-2 text-center"
					:class="{
						'gray--text text--lighten-1': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
					}"
					:size="20"
				>
					{{ mdiBrightness6 }}
				</v-icon>
				<div
					class="ma-0 ml-2 pa-0 d-flex flex-column justify-center align-start"
				>
					<span
						class="body-2"
						:class="{
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
						}"
					>
						{{ $t('profile.themeToogle.label', { value: theme === 'light'
							? 'dark'
							: 'light'
						}) }}
					</span>
				</div>
			</v-list-item>
			<v-divider
				class="my-0 mx-4 pa-0 bg-secondary"
			/>
			<v-list-item
				class="d-flex justify-start"
				ripple
				:title="$t('profile.logout.alt')"
				:alt="$t('profile.logout.alt')"
				@click="onLogout"
			>
				<v-icon
					class="ma-0 body-2 text-center"
					:class="{
						'gray--text text--lighten-1': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
					}"
					:size="20"
				>
					{{ mdiExitToApp }}
				</v-icon>
				<div
					class="ma-0 ml-2 pa-0 d-flex flex-column justify-center align-start"
				>
					<span
						class="body-2"
						:class="{
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
						}"
					>
						{{ $t('profile.logout.label') }}
					</span>
				</div>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	AUTH_MODULE,
	SET_TOKEN,
	SET_USER,
	SET_USER_PERMISSION,
	AUTHENTICATED,
	USER,
} from '@/store/auth/constants';
import {
	VIEW_MODULE,
	THEME,
	TOGGLE_THEME,
} from '@/store/view';
import {
	IMMUDB_MODULE,
	SET_STATE,
} from '@/store/immudb/constants';
import {
	DATABASE_MODULE,
	SET_ACTIVE_DATABASE,
	SET_TABLE_LIST,
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	OUTPUT_MODULE,
	RESET_OUTPUT,
} from '@/store/output/constants';
import {
	mdiBrightness6,
	mdiExitToApp,
} from '@mdi/js';

export default {
	name: 'ProfileMenu',
	data() {
		return {
			mdiBrightness6,
			mdiExitToApp,
		};
	},
	computed: {
		...mapGetters(AUTH_MODULE, {
			isAuthenticated: AUTHENTICATED,
			user: USER,
		}),
		...mapGetters(VIEW_MODULE, {
			theme: THEME,
		}),
		userInitials () {
			if (this.user) {
				const splitted = this.user.split(' ');
				if (splitted && splitted.length > 1) {
					return splitted
							.map(_ => _ && _[0])
							.join('.');
				}
				return this.user.substring(0, 2);
			}
			return '';
		},
	},
	methods: {
		...mapActions(AUTH_MODULE, {
			setToken: SET_TOKEN,
			setUser: SET_USER,
			setUserPermission: SET_USER_PERMISSION,
		}),
		...mapActions(VIEW_MODULE, {
			toggleTheme: TOGGLE_THEME,
		}),
		...mapActions(IMMUDB_MODULE, {
			setState: SET_STATE,
		}),
		...mapActions(DATABASE_MODULE, {
			setActiveDatabase: SET_ACTIVE_DATABASE,
			setTableList: SET_TABLE_LIST,
		}),
		...mapActions(OUTPUT_MODULE, {
			resetOutput: RESET_OUTPUT,
		}),
		onThemeToggle () {
			this.toggleTheme();
		},
		onLogout () {
			this.$cookies.set('instance', undefined);
			this.setToken(null);
			this.setUser(null);
			this.setUserPermission(null);
			this.setState({ tables: [] });
			this.setActiveDatabase({ active: DEFAULT_DB });
			this.setTableList({ tables: [] });
			this.resetOutput();
		},
	},
};
</script>
