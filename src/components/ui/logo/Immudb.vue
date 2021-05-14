<template>
	<div class="ma-0 mb-4 pa-0 d-flex flex-column justify-center align-start fill-width">
		<v-img
			class="immudb"
			:src="getAsset"
			:alt="$t('common.immudb')"
			:height="`${ height }px`"
			contain
			rel="preload"
		/>
	</div>
</template>

<script>
export default {
	name: 'UiPoweredBy',
	props: {
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
			return require(`@/static/images/immudb/text_${ this.getTheme }.${ this.getMime }`);
		},
	},
};
</script>
