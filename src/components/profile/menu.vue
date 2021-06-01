<template>
	<v-menu
		v-if="isAuthenticated"
		class="ma-0 pa-0 bg d-flex flex-column justify-center align-center"
		style="padding-bottom: 28px !important;"
		top
		offset-x
		:nudge-left="2"
		:nudge-bottom="2"
		open-on-hover
	>
		<template #activator="{ on, attrs }">
			<v-list-item
				class="ma-0 mb-4 pa-0"
				v-bind="attrs"
				v-on="on"
			>
				<v-avatar
					color="accent"
					:size="32"
				>
					<span
						class="ma-0 pa-0 white--text subtitle-2 text-uppercase"
						style="padding-top: 1px !important;"
					>
						{{ userInitials }}
					</span>
				</v-avatar>
			</v-list-item>
		</template>
		<v-list class="user-menu bg">
			<v-list-item
				class="d-flex justify-start"
				ripple
				:title="$t('common.username')"
				:alt="$t('common.username')"
			>
				<v-list-item-content>
					<v-list-item-title class="ma-0 mb-4 pa-0">
						<span class="ma-0 pa-0 body-2">
							{{ $t('common.username') }}
						</span>
						<span class="ma-0 pa-0 body-2 font-weight-bold">
							{{ user }}
						</span>
					</v-list-item-title>
					<v-divider />
				</v-list-item-content>
			</v-list-item>
			<v-list-item
				class="d-flex justify-start"
				ripple
				:title="$t('profile.preferences.alt')"
				:alt="$t('profile.preferences.alt')"
				@click="onProfileOpen"
			>
				<v-icon
					class="ma-0 body-2 text-center"
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiAccountSettingsOutline }}
				</v-icon>
				<div
					class="ma-0 ml-2 pa-0 d-flex flex-column justify-center align-start"
				>
					<span
						class="body-2"
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
						}"
					>
						{{ $t('profile.preferences.label') }}
					</span>
				</div>
			</v-list-item>
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
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiExitToApp }}
				</v-icon>
				<div
					class="ma-0 ml-2 pa-0 d-flex flex-column justify-center align-start"
				>
					<span
						class="body-2"
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
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
	mdiAccountSettingsOutline,
	mdiExitToApp,
} from '@mdi/js';

export default {
	name: 'ProfileMenu',
	data() {
		return {
			mdiAccountSettingsOutline,
			mdiExitToApp,
		};
	},
	computed: {
		...mapGetters(AUTH_MODULE, {
			isAuthenticated: AUTHENTICATED,
			user: USER,
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
		onProfileOpen () {
			this.$emit('profile');
		},
		onLogout () {
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
