<template>
	<v-tooltip
		top
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="add-to-query ma-0 py-0 px-1 d-flex justify-start align-center"
				color="accent"
				dense
				x-small
				v-bind="attrs"
				v-on="on"
				@click.native.stop="onSubmit(value)"
			>
				<v-icon
					class="ma-0 mr-1 pa-0"
					:class="{
						'grey--text text--darken-0': !$vuetify.theme.dark,
						'grey--text text--lighten-2': $vuetify.theme.dark,
					}"
					small
				>
					{{ mdiPlus }}
				</v-icon>
				<span>
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
