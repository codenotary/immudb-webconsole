<template>
	<div
		v-if="value"
		class="d-flex align-center"
	>
		{{ parsedValue }}
	</div>
</template>

<script>
export default {
	name: 'UiColumnsBase64',
	props: {
		value: { type: String, default: '' },
	},
	computed: {
		parsedValue () {
			if (this.value) {
				return atob(this.value);
			}
			return '';
		},
	},
};
</script>
