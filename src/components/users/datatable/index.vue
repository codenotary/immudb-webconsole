<template>
	<v-card class="ma-0 pa-0 bg">
		<v-card-text class="ma-0 pa-0 fill-height">
			<v-data-table
				ref="datatable"
				class="no-hover fill-height d-flex flex-column justify-space-between align-stretch"
				:headers="headers"
				:items="parsedItems"
				:items-per-page="itemsPerPage"
				item-key="id"
				item-class="config.class"
				:footer-props="footerProps"
				@pagination="onPaginationUpdate"
			>
				<template #[`item.user`]="{ item }">
					<UiColumnsBase64
						:value="item.user"
					/>
				</template>
				<template #[`item.createdat`]="{ item }">
					<UiColumnsDate
						:value="item.createdat"
					/>
				</template>
				<template #[`item.active`]="{ item }">
					<UiColumnsBadge
						:value="item.active"
					/>
				</template>
				<template #[`item.actions`]="{ item }">
					<UsersDatatableActions
						:id="item.id"
						:name="item.name"
					/>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import {
	mdiMagnify,
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
	data() {
		return {
			mdiMagnify,
			headers: [
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
					align: 'start',
					sortable: true,
				},
				{
					text: '',
					value: 'actions',
					align: 'center',
					sortable: false,
				},
			],
			footerProps: {
				itemsPerPageOptions: [10, 25, 50],
			},
		};
	},
	computed: {
		parsedItems () {
			if (this.items && this.items.length) {
				return this.items
						.filter(_ => _.user.includes(this.filter));
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
	},
};
</script>
