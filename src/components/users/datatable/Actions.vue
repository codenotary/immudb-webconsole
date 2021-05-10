<template>
	<span>
		<v-menu
			left
			:nudge-bottom="48"
		>
			<template #activator="{ on, attrs }">
				<v-btn
					icon
					v-bind="attrs"
					v-on="on"
				>
					<v-icon
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
						}"
					>
						{{ mdiCog }}
					</v-icon>
				</v-btn>
			</template>
			<v-list class="user-datatable-actions">
				<v-tooltip
					v-if="!disabled"
					left
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showDisableUserModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.action.disable.alt', { user })"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									:class="{
										'gray--text text--darken-1': !$vuetify.theme.dark,
										'gray--text text--lighten-1': $vuetify.theme.dark,
									}"
									:size="20"
								>
									{{ mdiAccountCancelOutline }}
								</v-icon>
								<span class="ma-0 ml-2 pa-0 body-2">
									{{ $t('users.table.action.disable.label', { user }) }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.action.disable.tooltip', { user }) }}
					</span>
				</v-tooltip>
				<v-tooltip
					v-if="disabled"
					left
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showEnableUserModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.action.enable.alt', { user })"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									:class="{
										'gray--text text--darken-1': !$vuetify.theme.dark,
										'gray--text text--lighten-1': $vuetify.theme.dark,
									}"
									:size="20"
								>
									{{ mdiAccountCheckOutline }}
								</v-icon>
								<span class="ma-0 ml-2 pa-0 body-2">
									{{ $t('users.table.action.enable.label', { user }) }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.action.enable.tooltip', { user }) }}
					</span>
				</v-tooltip>
				<v-tooltip
					left
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showUpdatePasswordModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.action.updatePassword.alt')"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									:class="{
										'gray--text text--darken-1': !$vuetify.theme.dark,
										'gray--text text--lighten-1': $vuetify.theme.dark,
									}"
									:size="20"
								>
									{{ mdiFormTextboxPassword }}
								</v-icon>
								<span class="ma-0 ml-2 pa-0 body-2">
									{{ $t('users.table.action.updatePassword.label') }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.action.updatePassword.tooltip') }}
					</span>
				</v-tooltip>
			</v-list>
		</v-menu>

		<!-- MODALS -->
		<UiModalConfirm
			v-model="showDisableUserModal"
			color="error"
			:title="$t('users.table.modal.disable.title', { user })"
			:confirm-text="$t('common.confirm')"
			:cancel-text="$t('common.cancel')"
			@confirm="onDisableUser"
		>
			<template #icon>
				<v-icon
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiAccountCancelOutline }}
				</v-icon>
			</template>
			<p v-html="$t('users.table.modal.disable.sure')" />
		</UiModalConfirm>
		<UiModalConfirm
			v-model="showEnableUserModal"
			color="success"
			:title="$t('users.table.modal.enable.title', { user })"
			:confirm-text="$t('common.confirm')"
			:cancel-text="$t('common.cancel')"
			@confirm="onEnableUser"
		>
			<template #icon>
				<v-icon
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiAccountCheckOutline }}
				</v-icon>
			</template>
			<p v-html="$t('users.table.modal.enable.sure')" />
		</UiModalConfirm>
		<UsersModalUpdatePassword
			v-model="showUpdatePasswordModal"
			color="warning"
			:user="user"
			@submit="onUpdatePassword"
		/>
		<UsersModalUpdatePermissions
			v-model="showUpdatePermissionsModal"
			color="warning"
			:user="user"
			@submit="onUpdatePermissions"
		/>
	</span>
</template>

<script>
import {
	mdiCog,
	mdiCircle,
	mdiAccountCancelOutline,
	mdiAccountCheckOutline,
	mdiFormTextboxPassword,
	mdiCardAccountDetailsOutline,
} from '@mdi/js';

export default {
	name: 'UsersDatatableActions',
	props: {
		item: { type: Object, default: () => {} },
	},
	data() {
		return {
			mdiCog,
			mdiCircle,
			mdiAccountCancelOutline,
			mdiAccountCheckOutline,
			mdiFormTextboxPassword,
			mdiCardAccountDetailsOutline,
			showDisableUserModal: false,
			showEnableUserModal: false,
			showUpdatePasswordModal: false,
			showUpdatePermissionsModal: false,
		};
	},
	computed: {
		user () {
			if (this.item) {
				const { user } = this.item;
				return atob(user);
			}
			return '';
		},
		disabled () {
			if (this.item) {
				const { active } = this.item;
				return !active;
			}
			return false;
		},
	},
	methods: {
		onDisableUser () {
			this.$emit('disable', {
				username: this.user,
				active: false,
			});
		},
		onEnableUser () {
			this.$emit('enable', {
				username: this.user,
				active: true,
			});
		},
		onUpdatePassword (data) {
			this.$emit('update:password', data);
		},
		onUpdatePermissions (data) {
			this.$emit('update:permissions', data);
		},
	},
};
</script>
