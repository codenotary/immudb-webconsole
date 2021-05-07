<template>
	<vue-json-pretty
		:path="'res'"
		:data="parsedValue"
		:deep="2"
		:virtual="true"
		:show-line="true"
		:collapsed-on-click-brackets="true"
	/>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
	name: 'UiColumnsJson',
	components: {
		VueJsonPretty,
	},
	props: {
		value: { type: Object, default: () => ({}) },
	},
	computed: {
		parsedValue () {
			try {
				if (typeof this.value === 'string') {
					return JSON.parse(this.value);
				}
				else {
					return this.value;
				}
			}
			catch (err) {
				console.error(err);
				return this.value;
			}
		},
	},
};
</script>
