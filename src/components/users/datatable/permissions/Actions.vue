<template>
	<span>
		<v-tooltip
			content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
			top
			:open-delay="100"
			:nudge-top="6"
		>
			<template #activator="{ on, attrs }">
				<v-btn
					class="no-ripple-hover"
					:loading="isLoading"
					color="secondary"
					icon
					:ripple="false"
					v-bind="attrs"
					v-on="on"
					@click="showUpdatePermissionModal = true"
				>
					<v-icon
						:class="{
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
						}"
						:size="20"
					>
						{{ mdiPencil }}
					</v-icon>
				</v-btn>
			</template>
			<span class="body-2">
				{{ $t('users.table.permissions.edit.tooltip', { value: `${ database }:${ parsedPermission }`, user }) }}
			</span>
		</v-tooltip>
		<v-tooltip
			content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
			top
			:open-delay="100"
			:nudge-top="6"
		>
			<template #activator="{ on, attrs }">
				<v-btn
					class="no-ripple-hover"
					color="secondary"
					:loading="isLoading"
					:ripple="false"
					icon
					v-bind="attrs"
					v-on="on"
					@click="showDeletePermissionModal = true"
				>
					<v-icon
						:class="{
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
						}"
						:size="20"
					>
						{{ mdiDelete }}
					</v-icon>
				</v-btn>
			</template>
			<span class="body-2">
				{{ $t('users.table.permissions.remove.tooltip', { value: `${ database }:${ parsedPermission }`, user }) }}
			</span>
		</v-tooltip>

		<!-- MODALS -->
		<UsersModalUpdatePermissions
			v-model="showUpdatePermissionModal"
			edit
			color="warning"
			:user="user"
			:database="database"
			:permission="permission"
			:parsed="parsedPermission"
			@submit="onUpdatePermissions"
		/>
		<UiModalConfirm
			v-model="showDeletePermissionModal"
			color="primary"
			:title="$t('users.table.permissions.remove.title', { value: `${ database }:${ parsedPermission }`, user })"
			:confirm-text="$t('common.confirm')"
			:cancel-text="$t('common.cancel')"
			@confirm="onDeletePermissions"
		>
			<p v-html="$t('users.table.modal.deactivate.sure')" />
		</UiModalConfirm>
	</span>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';
import {
	mdiPencil,
	mdiDelete,
} from '@mdi/js';

export default {
	name: 'UsersDatatablePermissionActions',
	props: {
		user: { type: String, default: '' },
		item: { type: Object, default: () => {} },
	},
	data() {
		return {
			mdiPencil,
			mdiDelete,
			showUpdatePermissionModal: false,
			showDeletePermissionModal: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
		database () {
			if (this.item) {
				const { database } = this.item;
				return database;
			}
			return '';
		},
		permission () {
			if (this.item) {
				const { permission } = this.item;
				return permission;
			}
			return '';
		},
		parsedPermission () {
			if (this.item) {
				const { permission } = this.item;
				return this.$t(`permissions.short.${ permission }`);
			}
			return '';
		},
	},
	methods: {
		onUpdatePermissions (data) {
			this.$emit('update:permissions', data);
		},
		onDeletePermissions (data) {
			this.$emit('update:permissions', {
				action: 'REVOKE',
				username: this.user,
				permission: this.permission,
				database: this.database,
			});
		},
	},
};
</script>
