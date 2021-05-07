<template>
	<div
		v-if="apiKeys && apiKeys.length"
		class="d-flex align-center"
	>
		{{ parsedApiKeys }}
	</div>
</template>

<script>
export default {
	name: 'UiColumnsApiKeys',
	props: {
		apiKeys: { type: Array, default: () => [] },
	},
	computed: {
		hasApiKeys() {
			return this.apiKeys.length > 0;
		},
		parsedApiKeys() {
			return this.hasApiKeys
				? this.getParsedApiKeys()
				: '';
		},
	},
	methods: {
		getParsedApiKeys() {
			const apiKeysMapper = ({ name = '' } = {}) => name;
			const API_KEYS_DELIMITER = ', ';

			return this.apiKeys
					.map(apiKeysMapper)
					.join(API_KEYS_DELIMITER);
		},
	},
};
</script>
