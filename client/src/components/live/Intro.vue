<template>
	<div class="live-intro-wrapper">
		<span
			class="live-intro"
			v-html="sanitizeIntro"
		/>
		<br>
		<br>
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
				const _value = value.replace(/\/n/, '<br>');
				return sanitizeHtml(_value);
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
