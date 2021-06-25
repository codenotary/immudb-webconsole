<template>
	<div class="table-actions d-flex flex-grow flex-shrink align-center">
		<QueryTablesActionAdd
			:value="item.value"
			@submit="onQueryUpdate"
		/>
		<div class="tags h-32 ml-1 d-flex justify-start align-center">
			<v-tooltip
				v-if="item.primaryKey"
				class="ma-0 ml-2 pa-0"
				content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
				top
				:open-delay="300"
				:nudge-top="6"
			>
				<template #activator="{ on, attrs }">
					<v-btn
						class="ma-0 pa-0 no-hover no-ripple-hover"
						icon
						x-small
						:ripple="false"
						v-bind="attrs"
						v-on="on"
					>
						<v-icon
							:class="{
								[`primary--text text--darken-0`]: !$vuetify.theme.dark,
								[`primary--text text--lighten-3`]: $vuetify.theme.dark,
							}"
							:size="14"
						>
							{{ mdiKey }}
						</v-icon>
					</v-btn>
				</template>
				<span class="body-2">
					{{ $t('query.tables.primaryKey') }}
				</span>
			</v-tooltip>
			<v-tooltip
				v-if="item.foreignKey"
				class="ma-0 ml-2 pa-0"
				content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
				top
				:open-delay="300"
				:nudge-top="6"
			>
				<template #activator="{ on, attrs }">
					<v-btn
						class="ma-0 pa-0 no-hover no-ripple-hover"
						icon
						x-small
						:ripple="false"
						v-bind="attrs"
						v-on="on"
					>
						<v-icon
							:class="{
								[`primary--text text--darken-0`]: !$vuetify.theme.dark,
								[`primary--text text--lighten-3`]: $vuetify.theme.dark,
							}"
							:size="14"
						>
							{{ mdiKeyLink }}
						</v-icon>
					</v-btn>
				</template>
				<span class="body-2">
					{{ $t('query.tables.foreignKey') }}
				</span>
			</v-tooltip>
			<v-tooltip
				v-if="item.nullable"
				class="ma-0 ml-2 pa-0"
				content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
				top
				:open-delay="300"
				:nudge-top="6"
			>
				<template #activator="{ on, attrs }">
					<v-btn
						class="ma-0 pa-0 no-hover no-ripple-hover"
						icon
						x-small
						:ripple="false"
						v-bind="attrs"
						v-on="on"
					>
						<v-icon
							:class="{
								[`primary--text text--darken-0`]: !$vuetify.theme.dark,
								[`primary--text text--lighten-3`]: $vuetify.theme.dark,
							}"
							:size="12"
						>
							{{ mdiDiameterVariant }}
						</v-icon>
					</v-btn>
				</template>
				<span class="body-2">
					{{ $t('query.tables.nullable') }}
				</span>
			</v-tooltip>
			<span
				class="ml-1 primary--text caption d-flex align-center"
				style="text-overflow: ellipsis;"
			>
				{{ item.tags }}
			</span>
		</div>
	</div>
</template>

<script>
import {
	mdiKey,
	mdiKeyLink,
	mdiDiameterVariant,
} from '@mdi/js';

export default {
	name: 'QueryTablesInfo',
	props: {
		item: { type: Object, default: () => {} },
	},
	data () {
		return {
			mdiKey,
			mdiKeyLink,
			mdiDiameterVariant,
		};
	},
	methods: {
		onQueryUpdate (data) {
			this.$emit('update', data);
		},
	},
};
</script>
