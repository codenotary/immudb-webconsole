<template>
	<div class="live-intro-wrapper ma-0 mb-4 pa-0 pb-4">
		<span
			class="live-intro"
			v-html="sanitizeIntro"
		/>
	</div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';

export default {
	name: 'LiveIntro',
	inject: ['terminate', 'intro'],
	computed: {
		sanitizeIntro () {
			if (this.intro) {
				const { value } = this.intro;
				// TODO allow classnames
				// return sanitizeHtml(value, {
				// 	allowedAttributes: 'class',
				// });
				return sanitizeHtml(value);
			}
			return '';
		},
	},
};
</script>

<style lang="scss">
.live-intro-wrapper {
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	margin-bottom: $spacer-6;
}
</style>
