<template>
	<span>
		<v-menu
			class="ma-0 pa-0 bg d-flex flex-column justify-center align-center outlined"
			left
			:nudge-bottom="48"
		>
			<template #activator="{ on, attrs }">
				<v-btn
					class="no-ripple-hover"
					color="primary"
					icon
					:ripple="false"
					v-bind="attrs"
					v-on="on"
				>
					<v-icon
						:class="{
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
						}"
						:size="20"
					>
						{{ mdiCogOutline }}
					</v-icon>
				</v-btn>
			</template>
			<v-list
				class="ma-0 pa-0 bg primary-outlined"
			>
				<v-tooltip
					v-if="!disabled"
					content-class="ma-0 py-2 px-4 bg primary-outlined"
					left
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showDeactiveUserModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								color="primary"
								:alt="$t('users.table.action.deactivate.alt', { user })"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									:class="{
										'gray--text text--lighten-1': !$vuetify.theme.dark,
										'gray--text text--lighten-4': $vuetify.theme.dark,
									}"
									:size="20"
								>
									{{ mdiAccountCancelOutline }}
								</v-icon>
								<span class="ma-0 ml-2 pa-0 body-2">
									{{ $t('users.table.action.deactivate.label', { user }) }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.action.deactivate.tooltip', { user }) }}
					</span>
				</v-tooltip>
				<v-tooltip
					v-if="disabled"
					content-class="ma-0 py-2 px-4 bg primary-outlined"
					left
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showActivateUserModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								color="primary"
								:alt="$t('users.table.action.activate.alt', { user })"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									:class="{
										'gray--text text--lighten-1': !$vuetify.theme.dark,
										'gray--text text--lighten-4': $vuetify.theme.dark,
									}"
									:size="20"
								>
									{{ mdiAccountCheckOutline }}
								</v-icon>
								<span class="ma-0 ml-2 pa-0 body-2">
									{{ $t('users.table.action.activate.label', { user }) }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.action.activate.tooltip', { user }) }}
					</span>
				</v-tooltip>
				<v-tooltip
					content-class="ma-0 py-2 px-4 bg primary-outlined"
					left
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showUpdatePasswordModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								color="primary"
								:alt="$t('users.table.action.updatePassword.alt')"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									:class="{
										'gray--text text--lighten-1': !$vuetify.theme.dark,
										'gray--text text--lighten-4': $vuetify.theme.dark,
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
			v-model="showDeactiveUserModal"
			color="primary"
			:title="$t('users.table.modal.deactivate.title', { user })"
			:confirm-text="$t('common.confirm')"
			:cancel-text="$t('common.cancel')"
			@confirm="onDeactivateUser"
		>
			<template #icon>
				<v-icon
					class="bg--text"
					:size="20"
				>
					{{ mdiAccountCancelOutline }}
				</v-icon>
			</template>
			<p
				:class="{
					'gray--text text--lighten-1': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
				v-html="$t('users.table.modal.deactivate.sure')"
			/>
		</UiModalConfirm>
		<UiModalConfirm
			v-model="showActivateUserModal"
			color="success"
			:title="$t('users.table.modal.activate.title', { user })"
			:confirm-text="$t('common.confirm')"
			:cancel-text="$t('common.cancel')"
			@confirm="onActivateUser"
		>
			<template #icon>
				<v-icon
					class="bg--text"
					:size="20"
				>
					{{ mdiAccountCheckOutline }}
				</v-icon>
			</template>
			<p
				:class="{
					'gray--text text--lighten-1': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
				v-html="$t('users.table.modal.activate.sure')"
			/>
		</UiModalConfirm>
		<UsersModalUpdatePassword
			v-model="showUpdatePasswordModal"
			color="primary"
			:user="user"
			@submit="onUpdatePassword"
		/>
		<UsersModalUpdatePermissions
			v-model="showUpdatePermissionsModal"
			color="primary"
			:user="user"
			@submit="onUpdatePermissions"
		/>
	</span>
</template>

<script>
import {
	mdiCogOutline,
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
			mdiCogOutline,
			mdiCircle,
			mdiAccountCancelOutline,
			mdiAccountCheckOutline,
			mdiFormTextboxPassword,
			mdiCardAccountDetailsOutline,
			showDeactiveUserModal: false,
			showActivateUserModal: false,
			showUpdatePasswordModal: false,
			showUpdatePermissionsModal: false,
		};
	},
	computed: {
		user () {
			if (this.item) {
				const { user } = this.item;
				return user;
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
		onDeactivateUser () {
			this.$emit('deactivate', {
				username: this.user,
				active: false,
			});
		},
		onActivateUser () {
			this.$emit('activate', {
				username: this.user,
				active: true,
			});
		},
		onUpdatePassword (data) {
			this.$emit('update:password', data);
		},
		onUpdatePermissions (data) {
			console.log(data);
			this.$emit('update:permissions', data);
		},
	},
};
</script>
