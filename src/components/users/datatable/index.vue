<template>
	<v-row class="ma-0 pa-0">
		<v-col cols="12">
			<v-row class="d-flex justify-end align-items">
				<v-col
					class="py-0"
					cols="12"
					sm="6"
					md="4"
					lg="3"
				>
					<v-text-field
						v-model="keyword"
						:label="$t('search')"
						single-line
						hide-details
						clearable
						@input="onKeywordUpdate"
					>
						<template #prepend>
							<v-icon
								:class="{
									'gray--text text--darken-1': !$vuetify.theme.dark,
									'gray--text text--lighten-1': $vuetify.theme.dark,
								}"
							>
								{{ mdiMagnify }}
							</v-icon>
						</template>
					</v-text-field>
				</v-col>
			</v-row>
		</v-col>
		<v-col
			class="mt-2 px-0"
			cols="12"
		>
			<v-divider />
		</v-col>
		<v-col
			class="px-0 pt-0"
			cols="12"
		>
			<v-data-table
				ref="datatable"
				class="no-hover"
				:headers="headers"
				:items="items"
				:items-per-page="itemsPerPage"
				:server-items-length="totalItems"
				item-key="id"
				item-class="config.class"
				:footer-props="footerProps"
				@pagination="onPaginationUpdate"
			>
				<template #[`item.actions`]="{ item }">
					<LedgerDatatableActions
						:id="item.id"
						:name="item.name"
					/>
				</template>
			</v-data-table>
		</v-col>
	</v-row>
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
	},
	data() {
		return {
			mdiMagnify,
			keyword: '',
			headers: [
				{
					text: this.$t('ledgers.table.name'),
					value: 'name',
					align: 'start',
					sortable: true,
				},
				{
					text: this.$t('ledgers.table.actions'),
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
