<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		top
	>
		<template #activator="{ on, attrs }">
			<span
				class="ma-0 pa-0 h-24 caption d-flex justify-start align-center"
				:class="{
					'black--text ': !$vuetify.theme.dark,
					'white--text': $vuetify.theme.dark,
				}"
				v-bind="attrs"
				v-on="on"
			>
				{{ $t('footer.version.prepend') }}
				<span class="caption d-flex justify-start align-center">
					{{ value }}
				</span>
			</span>
		</template>
		{{ $t('footer.version.tooltip') }}
	</v-tooltip>
</template>

<script>
export default {
	name: 'UiImmudbVersion',
	props: {
		value: { type: String, default: '1.0.1' },
	},
};
</script>
