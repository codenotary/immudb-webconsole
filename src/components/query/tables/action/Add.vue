<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				class="add-to-query ma-0 py-0 px-1 d-flex justify-start align-center"
				color="primary"
				dense
				outlined
				x-small
				v-bind="attrs"
				v-on="on"
				@click.native.stop="onSubmit(value)"
			>
				<v-icon
					class="ma-0 mr-1 pa-0 primary--text"
					small
				>
					{{ mdiPlus }}
				</v-icon>
				<span class="body-2">
					{{ $t('query.tables.add.button') }}
				</span>
			</v-btn>
		</template>
		{{ $t('query.tables.add.tooltip', { value }) }}
	</v-tooltip>
</template>

<script>
import {
	mdiPlus,
} from '@mdi/js';

export default {
	name: 'QueryTablesActionAdd',
	props: {
		value: { type: String, default: '' },
	},
	data () {
		return {
			mdiPlus,
		};
	},
	methods: {
		onSubmit () {
			this.$emit('submit', {
				value: this.value,
			});
		},
	},
};
</script>
