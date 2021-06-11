<template>
	<section class="permissions-list-detail ma-0 pa-0 pl-4">
		<div
			class="permissions-detail ma-4 pa-4 pb-0 bg fill-width"
			cols="12"
			sm="3"
		>
			<p class="ma-0 pa-0 d-flex justify-space-between align-center">
				<span class="caption praimry--text text-uppercase">
					{{ $t('users.table.permissions.title') }}:
				</span>
				<v-tooltip
					content-class="ma-0 py-2 px-4 bg primary-outlined"
					top
					:open-delay="100"
				>
					<template #activator="{ on, attrs }">
						<v-btn
							color="primary"
							:loading="isLoading"
							outlined
							small
							v-bind="attrs"
							v-on="on"
							@click="showAddPermissionModal = true"
						>
							<v-icon
								class="title"
								:size="20"
							>
								{{ mdiShapeCirclePlus }}
							</v-icon>
							<span
								class="my-0 ml-2 body-2 text-capitalize"
							>
								{{ $t('users.table.permissions.add.label') }}
							</span>
						</v-btn>
					</template>
					<span class="body-2">
						{{ $t('users.table.permissions.add.tooltip', { user }) }}
					</span>
				</v-tooltip>
			</p>
			<v-divider
				class="ma-0 mt-4 pa-0 thick"
			/>
			<v-data-table
				ref="datatable"
				class="no-hover fill-height d-flex flex-column justify-space-between align-stretch"
				:headers="headers"
				:items="items"
				:items-per-page="itemsPerPage"
				item-key="id"
				item-class="config.class"
				:footer-props="footerProps"
				hide-default-footer
			>
				<template #[`item.database`]="{ item }">
					<UsersDatatablePermissionsDatabase
						:value="item.database"
					/>
				</template>
				<template #[`item.permission`]="{ item }">
					<UiColumnsPermission
						:value="item.permission"
					/>
				</template>
				<template #[`item.actions`]="{ item }">
					<UsersDatatablePermissionsActions
						:item="item"
						:user="user"
						@update:permissions="onUpdatePermissions"
					/>
				</template>
			</v-data-table>
		</div>

		<!-- MODALS -->
		<UsersModalUpdatePermissions
			v-model="showAddPermissionModal"
			color="warning"
			:user="user"
			add
			@submit="onAddPermission"
		/>
	</section>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';
import {
	mdiShapeCirclePlus,
} from '@mdi/js';

export default {
	name: 'UsersDatatablePermissions',
	props: {
		user: { type: String, default: '' },
		items: { type: Array, default: () => [] },
		itemsPerPage: { type: Number, default: 0 },
		totalItems: { type: Number, default: 0 },
	},
	data () {
		return {
			mdiShapeCirclePlus,
			showAddPermissionModal: false,
			headers: [
				{
					text: this.$t('users.table.permissions.database'),
					value: 'database',
					align: 'start',
					sortable: true,
				},
				{
					text: this.$t('users.table.permissions.permission'),
					value: 'permission',
					align: 'center',
					sortable: true,
				},
				{
					text: '',
					value: 'actions',
					align: 'center action-wrapper',
					sortable: false,
				},
			],
			footerProps: {
				itemsPerPageOptions: [10, 25, 50],
			},
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
	},
	methods: {
		onAddPermission (data) {
			this.$emit('add:permission', data);
		},
		onUpdatePermissions (data) {
			this.$emit('update:permissions', data);
		},
	},
};
</script>

<style lang="scss">
section.permissions-list-detail {
	width: 98% !important;

	.permissions-detail {
		border: 1px solid $primary !important;
		border-radius: $border-radius-root;

		table {
			width: 100%;
			border-collapse: collapse;

			tr {
				th,
				td {
					padding: $spacer-1 0;
				}

				td {
					&.database {
						width: 20% !important;
						max-width: 20% !important;
						vertical-align: top !important;
					}

					&.permission {
						word-break: break-all;
					}
				}
			}
		}
	}
}
</style>
