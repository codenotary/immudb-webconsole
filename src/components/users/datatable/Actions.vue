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
					right
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showDisableUserModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.actions.disable.alt')"
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
									{{ $t('users.table.actions.disable.label') }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.actions.disable.tooltip') }}
					</span>
				</v-tooltip>
				<v-tooltip
					v-if="disabled"
					right
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showEnableUserModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.actions.enable.alt')"
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
									{{ $t('users.table.actions.enable.label') }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.actions.enable.tooltip') }}
					</span>
				</v-tooltip>
				<v-tooltip
					right
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showChangePasswordModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.actions.changePassword.alt')"
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
									{{ $t('users.table.actions.changePassword.label') }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.actions.changePassword.tooltip') }}
					</span>
				</v-tooltip>
				<v-tooltip
					right
				>
					<template #activator="{ on, attrs }">
						<v-list-item
							@click="showChangePermissionsModal = true"
						>
							<v-list-item-title
								class="d-flex justify-start align-center"
								:alt="$t('users.table.actions.changePermissions.alt')"
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
									{{ mdiCardAccountDetailsOutline }}
								</v-icon>
								<span class="ma-0 ml-2 pa-0 body-2">
									{{ $t('users.table.actions.changePermissions.label') }}
								</span>
							</v-list-item-title>
						</v-list-item>
					</template>
					<span class="body-2">
						{{ $t('users.table.actions.changePermissions.tooltip') }}
					</span>
				</v-tooltip>
			</v-list>
		</v-menu>

		<!-- MODALS -->
		<!-- <UiModalConfirm
			v-model="showDeleteUserModal"
			color="warning"
			:title="$t('ledgers.confirmEnableModal.title')"
			:confirm-text="$t('ledgers.confirmEnableModal.confirmText')"
			:cancel-text="$t('ledgers.confirmEnableModal.cancelText')"
			@confirm="onDeleteUser"
		>
			<p>
				{{ $t('ledgers.confirmEnableModal.text') }}
			</p>
		</UiModalConfirm> -->
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
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		disabled: { type: Boolean, default: false },
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
			showChangePasswordModal: false,
			showChangePermissionsModal: false,
		};
	},
	methods: {
		onDeleteUser(data) {
			console.log(data);
		},
	},
};
</script>
