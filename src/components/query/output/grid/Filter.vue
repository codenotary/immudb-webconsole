<template>
	<v-select
		v-model="value"
		class="ma-0 mt-1 pa-0"
		:class="{
			'gray--text text--darken-3': !$vuetify.theme.dark,
			'gray--text text--lighten-4': $vuetify.theme.dark,
		}"
		color="grey darken-2"
		:items="items"
		:label="$t('query.output.filter.label')"
		hide-details
		dense
	/>
</template>

<script>
export default {
	name: 'QueryOutputGridFilter',
	props: {
		filter: { type: String, default: '' },
	},
	data () {
		return {
			value: '',
			items: ['all', 'stdtable', 'stderr'],
		};
	},
	watch: {
		filter: {
			immediate: true,
			handler (newVal, oldVal) {
				if (newVal !== oldVal) {
					this.value = newVal;
				}
			},
		},
		value (newVal) {
			this.$emit('update:filter', newVal);
		},
	},
};
</script>
