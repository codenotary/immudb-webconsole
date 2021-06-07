<template>
	<v-card
		id="Users"
		class="ma-0 pa-0 pr-4 bg fill-height pane"
		elevation="4"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'black--text ': !$vuetify.theme.dark,
					'white--text': $vuetify.theme.dark,
				}"
			>
				{{ mdiAccountCogOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'black--text ': !$vuetify.theme.dark,
					'white--text': $vuetify.theme.dark,
				}"
			>
				{{ $t('users.title') }}
			</h4>
			<v-spacer />
			<span
				class="ma-0 mr-2 pa-0 caption"
				:class="{
					'black--text ': !$vuetify.theme.dark,
					'white--text': $vuetify.theme.dark,
				}"
			>
				{{ $t('users.action.hideNotActive.label') }}
			</span>
			<LazyUsersActionHideNotActive />
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<LazyUsersActionFilter
				:filter.sync="filter"
			/>
			<v-divider
				v-if="showAdd"
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<LazyUsersActionAdd
				v-if="showAdd"
				@submit="showAddUser = true"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary fill-height custom-scrollbar"
		>
			<div class="ma-0 pa-0">
				<LazyUsersDatatable
					class="ma-0 pa-0"
					:filter="filter"
					:items="userList"
					@deactivate="onDeactivateUser"
					@activate="onActivateUser"
					@update:password="onUpdatePassword"
					@add:permission="onUpdatePermissions"
					@update:permissions="onUpdatePermissions"
				/>
			</div>
		</v-card-text>

		<!-- MODALS -->
		<LazyUsersModalAdd
			v-model="showAddUser"
			color="success"
			@submit="onAddUser"
		/>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SPLASH,
} from '@/store/view/constants';
import {
	AUTH_MODULE,
	SET_TOKEN,
	AUTHENTICATED,
	USER,
	USER_PERMISSION,
} from '@/store/auth/constants';
import {
	DEFAULT_DB,
} from '@/store/database/constants';
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
		...mapGetters(VIEW_MODULE, {
			splash: SPLASH,
		}),
		...mapGetters(AUTH_MODULE, {
			authenticated: AUTHENTICATED,
			user: USER,
			userPermission: USER_PERMISSION,
		}),
		...mapGetters(USER_MODULE, {
			userList: USER_LIST,
		}),
		showAdd () {
			try {
				const { permission } = this.userPermission(DEFAULT_DB) ||
					{ permission: 0 };
				return permission >= 254;
			}
			catch (err) {
				console.error(err);
				return false;
			}
		},
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
		...mapActions(AUTH_MODULE, {
			setToken: SET_TOKEN,
		}),
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
				if (!this.splash) {
					this.$toasted.success(this.$t('users.action.add.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onDeactivateUser(data) {
			try {
				await this.setActiveUser(data);
				await this.fetchUserList();
				if (!this.splash) {
					this.$toasted.success(this.$t('users.table.action.deactivate.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onActivateUser(data) {
			try {
				await this.setActiveUser(data);
				await this.fetchUserList();
				if (!this.splash) {
					this.$toasted.success(this.$t('users.table.action.activate.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onUpdatePassword(data) {
			try {
				if (data) {
					const { user } = data;
					await this.updatePassword(data);
					if (user === this.user) {
						this.setToken(null);
					}
					this.$nextTick(() => {
						this.fetchUserList();
						if (!this.splash) {
							this.$toasted.success(this.$t('users.table.action.updatePassword.success'), {
								duration: 3000,
								icon: 'check-circle',
							});
						}
					});
				}
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onAddPermission(data) {
			try {
				await this.updatePermissions(data);
				await this.fetchUserList();
				if (!this.splash) {
					this.$toasted.success(this.$t('users.table.permissions.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onUpdatePermissions(data) {
			try {
				await this.updatePermissions(data);
				await this.fetchUserList();
				if (!this.splash) {
					this.$toasted.success(this.$t('users.table.action.updatePermissions.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
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
