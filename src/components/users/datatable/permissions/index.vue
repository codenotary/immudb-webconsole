<template>
	<section class="permissions-list-detail ma-0 pa-0 pl-4">
		<div
			class="permissions-detail ma-4 ml-4 pa-4 bg fill-width"
			cols="12"
			sm="3"
		>
			<p class="ma-0 pa-0 d-flex justify-space-between align-center">
				<span class="caption">
					{{ $t('users.table.permissions.title') }}:
				</span>
				<v-tooltip
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
							{{ $t('users.table.permissions.add.label') }}
						</v-btn>
					</template>
					<span class="body-2">
						{{ $t('users.table.permissions.add.tooltip', { user }) }}
					</span>
				</v-tooltip>
			</p>
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
.v-application {
	&.theme--dark {
		.permissions-detail {
			table {
				tr {
					&:not(:last-child) {
						border-bottom: 1px solid rgba(255, 255, 255, 0.15);
					}
				}
			}
		}
	}

	&.theme--light {
		.permissions-detail {
			table {
				tr {
					&:not(:last-child) {
						border-bottom: 1px solid rgba(0, 0, 0, 0.15);
					}
				}
			}
		}
	}
}

section.permissions-list-detail {
	width: 98% !important;

	.permissions-detail {
		border: 1px solid rgba(0, 0, 0, 0.46) !important;
		border-radius: 4px;

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
