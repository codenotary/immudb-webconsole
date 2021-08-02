<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<span
				class="ma-0 pa-0 h-24 caption d-flex justify-start align-center"
				:class="{
					'gray--text text--lighten-1': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
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
		<span class="body-2">
			{{ $t('footer.version.tooltip') }}
		</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'UiImmudbVersion',
	props: {
		value: { type: String, default: '1.0.5' },
	},
};
</script>
