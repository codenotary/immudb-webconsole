<template>
	<v-select
		v-model="value"
		class="grey--text text--darken-2"
		color="grey darken-2"
		:items="items"
		:label="$t('output.code.filter.label')"
		hide-details
		dense
	/>
</template>

<script>
export default {
	name: 'OutputCodeFilter',
	props: {
		filter: { type: String, default: '' },
	},
	data () {
		return {
			value: '',
			items: ['all', 'stdout', 'stderr', 'execerr'],
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
