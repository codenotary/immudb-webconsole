<template>
	<v-select
		v-model="value"
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
			items: ['all', 'stdout', 'stderr'],
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
