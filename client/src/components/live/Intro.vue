<template>
	<span
		class="live-intro ma-0 mb-4 pa-0 pb-4"
		v-html="sanitizeIntro"
	/>
</template>

<script>
export default {
	name: 'LiveIntro',
	inject: ['terminate', 'intro'],
	computed: {
		sanitizeIntro () {
			if (this.intro) {
				const { value } = this.intro;
				return value;
			}
			return '';
		},
	},
};
</script>
