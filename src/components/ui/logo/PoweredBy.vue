<template>
	<div class="ma-0 mb-4 pa-0 d-flex flex-column justify-center align-start fill-width">
		<span
			class="ma-0 mb-n5 pl-4 pa-0 caption d-flex justify-center  fill-width"
			:class="{
				'gray--text text--lighten-1': !$vuetify.theme.dark,
				'gray--text text--lighten-4': $vuetify.theme.dark,
			}"
		>
			{{ $t('common.poweredBy') }}
		</span>
		<v-img
			class="immudb"
			:src="getAsset"
			:alt="$t('common.immudb')"
			:height="`${ height }px`"
			contain
		/>
	</div>
</template>

<script>
export default {
	name: 'UiLogoPoweredBy',
	props: {
		text: { type: Boolean, default: true },
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
			return require(`@/static/images/immudb/logo_${ this.getTheme }${ (this.text ? '_text' : '') }.${ this.getMime }`);
		},
	},
};
</script>
