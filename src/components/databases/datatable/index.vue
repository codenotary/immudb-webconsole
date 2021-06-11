<template>
	<v-card class="ma-0 pa-0 elevation-4">
		<v-card-text class="ma-0 pa-0 bg fill-height">
			<v-data-table
				ref="datatable"
				class="no-hover d-flex flex-column justify-space-between align-stretch"
				style="overflow-y: auto !important;"
				:headers="headers"
				:items="parsedItems"
				:items-per-page="itemsPerPage"
				item-key="id"
				item-class="config.class"
				:footer-props="footerProps"
				hide-default-footer
				@click:row="(item, slot) => slot.expand(!slot.isExpanded)"
			>
				<template #[`item.active`]="{ item }">
					<UiColumnsBadge
						v-if="!!item.active"
						:value="item.active"
						color="primary"
					/>
				</template>
				<template #[`item.actions`]="{ item }">
					<DatabasesDatatableActions
						:item="item"
						:disabled="!!item.active"
						@update:use="onUseDatabase"
					/>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	DATABASE_MODULE,
	ACTIVE_DATABASE,
} from '@/store/database/constants';

const debounce = require('lodash.debounce');

export default {
	name: 'DatabasesDatatable',
	props: {
		items: { type: Array, default: () => [] },
		itemsPerPage: { type: Number, default: 0 },
		totalItems: { type: Number, default: 0 },
		filter: { type: String, default: '' },
	},
	data () {
		return {
			headers: [
				{
					text: this.$t('databases.table.databaseName'),
					value: 'databaseName',
					align: 'start',
					sortable: true,
				},
				{
					text: this.$t('databases.table.active'),
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
		...mapGetters(DATABASE_MODULE, {
			activeDatabase: ACTIVE_DATABASE,
		}),
		parsedItems () {
			if (this.items && this.items.length) {
				return this.items
						.filter((_) => {
							return _.databaseName && _.databaseName
									.includes(this.filter || '');
						})
						.map((_, idx) => {
							return {
								id: idx,
								active: _.databaseName === this.activeDatabase
									? this.$t('common.active')
									: undefined,
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
		onUseDatabase (data) {
			this.$emit('update:use', data);
		},
	},
};
</script>
