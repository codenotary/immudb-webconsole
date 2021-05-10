<template>
	<v-card
		id="Users"
		class="ma-0 pa-0 pr-4 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiAccountCogOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('users.title') }}
			</h4>
			<v-spacer />
			<UsersActionFilter
				:filter.sync="filter"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<UsersActionAdd
				@submit="showAddUser = true"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary fill-height custom-scrollbar"
		>
			<div class="ma-0 pa-0">
				<UsersDatatable
					class="ma-0 pa-0"
					:filter="filter"
					:items="userList"
					@disable="onDisableUser"
					@enable="onEnableUser"
					@update:password="onUpdatePassword"
					@add:permission="onUpdatePermissions"
					@update:permissions="onUpdatePermissions"
				/>
			</div>
		</v-card-text>

		<!-- MODALS -->
		<UsersModalAdd
			v-model="showAddUser"
			color="success"
			@submit="onAddUser"
		/>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	AUTH_MODULE,
	AUTHENTICATED,
} from '@/store/auth/constants';
import {
	USER_MODULE,
	FETCH_USER_LIST,
	SET_USER_LIST,
	SET_ACTIVE_USER,
	ADD_USER,
	UPDATE_PASSWORD,
	UPDATE_PERMISSIONS,
	USER_LIST,
} from '@/store/user/constants';

import {
	mdiAccountCogOutline,
} from '@mdi/js';

export default {
	name: 'Users',
	async fetch () {
		await this.fetchUserList();
	},
	data () {
		return {
			mdiAccountCogOutline,
			filter: '',
			showAddUser: false,
		};
	},
	computed: {
		...mapGetters(AUTH_MODULE, {
			authenticated: AUTHENTICATED,
		}),
		...mapGetters(USER_MODULE, {
			userList: USER_LIST,
		}),
	},
	watch: {
		authenticated: {
			deep: true,
			handler (newVal) {
				if (newVal) {
					this.fetchUserList();
				}
				else {
					this.setUserList({ users: [] });
				}
			},
		},
	},
	methods: {
		...mapActions(USER_MODULE, {
			fetchUserList: FETCH_USER_LIST,
			setUserList: SET_USER_LIST,
			addUser: ADD_USER,
			setActiveUser: SET_ACTIVE_USER,
			updatePassword: UPDATE_PASSWORD,
			updatePermissions: UPDATE_PERMISSIONS,
		}),
		async onAddUser (data) {
			try {
				await this.addUser(data);
				await this.fetchUserList();
				this.$toasted.success(this.$t('users.action.add.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onDisableUser(data) {
			try {
				await this.setActiveUser(data);
				await this.fetchUserList();
				this.$toasted.success(this.$t('users.table.action.disable.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onEnableUser(data) {
			try {
				await this.setActiveUser(data);
				await this.fetchUserList();
				this.$toasted.success(this.$t('users.table.action.enable.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onUpdatePassword(data) {
			try {
				await this.updatePassword(data);
				await this.fetchUserList();
				this.$toasted.success(this.$t('users.table.action.updatePassword.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onAddPermission(data) {
			try {
				await this.updatePermissions(data);
				await this.fetchUserList();
				this.$toasted.success(this.$t('users.table.permissions.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onUpdatePermissions(data) {
			try {
				await this.updatePermissions(data);
				await this.fetchUserList();
				this.$toasted.success(this.$t('users.table.action.updatePermissions.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
	},
};
</script>

<style lang="scss">
#Users {
	&.pane {
		&::after {
			content: '';
			position: absolute;
			top: calc(#{$spacer-12} + 1px);
			right: calc(#{$spacer-4} + 1px);
			bottom: 0;
			left: 1px;
			pointer-events: none !important;
		}

		&.theme-- {
			&light {
				&::after {
					outline: 1px solid rgba(0, 0, 0, 0.05);
				}
			}
		}
	}
}
</style>
