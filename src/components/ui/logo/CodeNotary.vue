<template>
	<div class="ma-0 mb-4 pa-0 d-flex flex-column justify-center align-start fill-width">
		<v-img
			class="immudb"
			:src="getAsset"
			:alt="$t('common.codenotary')"
			:height="`${ height }px`"
			contain
		/>
	</div>
</template>

<script>
export default {
	name: 'UiLogoCodeNotary',
	props: {
		icon: { type: Boolean, default: false },
		svg: { type: Boolean, default: true },
		height: { type: [String, Number], default: 48 },
	},
	computed: {
		getTheme () {
			return this.$vuetify.theme.dark ? 'dark' : 'light';
		},
		getMime () {
			return this.svg ? 'svg' : 'png';
		},
		getAsset () {
			return require(`@/static/images/codenotary/logo_${ this.getTheme }${ (this.icon ? '_icon' : '') }.${ this.getMime }`);
		},
	},
};
</script>
