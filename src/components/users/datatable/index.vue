<template>
	<v-card class="ma-0 pa-0">
		<v-card-text class="ma-0 pa-0 bg fill-height">
			<v-data-table
				ref="datatable"
				class="d-flex flex-column justify-space-between align-stretch"
				style="overflow-y: auto !important;"
				:headers="headers"
				:items="parsedItems"
				:items-per-page="itemsPerPage"
				item-key="id"
				item-class="config.class"
				:footer-props="footerProps"
				show-expand
				hide-default-footer
				@click:row="(item, slot) => slot.expand(!slot.isExpanded)"
			>
				<template #[`item.data-table-expand`]="{ isExpanded }">
					<v-icon
						class="ma-0 pa-0"
						:size="18"
					>
						{{ isExpanded
							? mdiChevronUp
							: mdiChevronDown
						}}
					</v-icon>
				</template>
				<template #[`item.user`]="{ item }">
					<span class="ma-0 pa-0 d-flex justify-start align-center">
						<v-icon
							v-if="item.user === user"
							class="ma-0 pa-0"
							:size="18"
						>
							{{ mdiAccountOutline }}
						</v-icon>
						<span class="ma-0 pa-0">
							{{ item.user }}
						</span>
					</span>
				</template>
				<template #[`item.createdat`]="{ item }">
					<UiColumnsDate
						:value="item.createdat"
					/>
				</template>
				<template #[`item.active`]="{ item }">
					<UiColumnsActive
						:value="!!item.active"
					/>
				</template>
				<template #[`item.actions`]="{ item }">
					<UsersDatatableActions
						:item="item"
						@deactivate="onDeactivateUser"
						@activate="onActivateUser"
						@update:password="onUpdatePassword"
						@update:permissions="onUpdatePermissions"
					/>
				</template>
				<template #[`expanded-item`]="{ headers: expandedHeaders, item }">
					<td :colspan="expandedHeaders.length">
						<UsersDatatablePermissions
							:items="item.permissions"
							:user="item.user"
							@add:permission="onAddPermission"
							@update:permissions="onUpdatePermissions"
						/>
					</td>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	HIDE_NOT_ACTIVE,
} from '@/store/view/constants';
import {
	AUTH_MODULE,
	USER,
} from '@/store/auth/constants';
import {
	mdiChevronUp,
	mdiChevronDown,
	mdiAccountOutline,
} from '@mdi/js';

const debounce = require('lodash.debounce');

export default {
	name: 'UsersDatatable',
	props: {
		items: { type: Array, default: () => [] },
		itemsPerPage: { type: Number, default: 0 },
		totalItems: { type: Number, default: 0 },
		filter: { type: String, default: '' },
	},
	data () {
		return {
			mdiChevronUp,
			mdiChevronDown,
			mdiAccountOutline,
			headers: [
				{
					text: '',
					value: 'data-table-expand',
					align: 'start',
					sortable: false,
					groupable: false,
				},
				{
					text: this.$t('users.table.user'),
					value: 'user',
					align: 'start',
					sortable: true,
				},
				{
					text: this.$t('users.table.createdBy'),
					value: 'createdby',
					align: 'start',
					sortable: true,
				},
				{
					text: this.$t('users.table.createdAt'),
					value: 'createdat',
					align: 'start',
					sortable: true,
				},
				{
					text: this.$t('users.table.active'),
					value: 'active',
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
		...mapGetters(AUTH_MODULE, {
			user: USER,
		}),
		...mapGetters(VIEW_MODULE, {
			hideNotActive: HIDE_NOT_ACTIVE,
		}),
		parsedItems () {
			if (this.items && this.items.length) {
				return this.items
						.filter((_) => {
							const _user = _.user;
							return _user && _user.includes(this.filter || '');
						})
						.filter((_) => {
							return !this.hideNotActive || _.active;
						})
						.map((_, idx) => {
							return {
								id: idx,
								..._,
							};
						});
			}
			return [];
		},
	},
	methods: {
		onKeywordUpdate: debounce(function() {
			const { page, itemsPerPage } = this.$refs.datatable;
			this.$emit('update', {
				page,
				itemsPerPage,
				filter: this.keyword,
			});
		}, 600),
		onPaginationUpdate(data) {
			const { page, itemsPerPage } = data;
			this.$emit('update', {
				page,
				itemsPerPage,
				filter: this.keyword,
			});
		},
		onDeactivateUser (data) {
			this.$emit('deactivate', data);
		},
		onActivateUser (data) {
			this.$emit('activate', data);
		},
		onUpdatePassword (data) {
			this.$emit('update:password', data);
		},
		onAddPermission (data) {
			this.$emit('add:permission', data);
		},
		onUpdatePermissions (data) {
			this.$emit('update:permissions', data);
		},
	},
};
</script>
