<template>
	<div>
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
				return sanitizeHtml(this.intro.value);
			}
			return '';
		},
	},
};
</script>

<style lang="scss">
.live-intro {
	// background-color: blue !important;
}
</style>
