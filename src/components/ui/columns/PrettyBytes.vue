<template>
	<div
		v-if="totalSizeInBytes !== undefined"
		class="d-flex align-center"
	>
		{{ parsedItem }}
	</div>
</template>

<script>
import prettyBytes from 'pretty-bytes';

export default {
	name: 'UiColumnsPrettyBytes',
	props: {
		totalSizeInBytes: { type: [String, Number], default: '' },
	},
	computed: {
		parsedItem () {
			return prettyBytes(this.totalSizeInBytes || 0);
		},
	},
};
</script>
