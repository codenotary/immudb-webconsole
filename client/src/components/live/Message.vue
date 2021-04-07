<template>
	<div class="live-message-wrapper ma-0 pa-0">
		<span
			class="live-message"
			:class="classname"
			v-html="sanitizeMessages"
		/>
	</div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';

export default {
	name: 'LiveMessage',
	inject: ['terminate', 'message', 'flux'],
	computed: {
		sanitizeMessages () {
			if (this.message()) {
				return sanitizeHtml(this.message());
			}
			return '';
		},
		classname () {
			return this.flux();
		},
	},
};
</script>
