<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		top
	>
		<template #activator="{ on, attrs }">
			<span
				class="ma-0 pa-0 d-flex justify-center align-center"
				v-bind="attrs"
				v-on="on"
			>
				<v-chip
					class="ma-0 py-0 px-2 caption text-uppercase elevation-2"
					color="accent"
					style="border-radius: 8px; height: 28px;"
				>
					{{ $t('footer.devMode.label') }}
				</v-chip>
			</span>
		</template>
		{{ $t('footer.devMode.tooltip') }}
	</v-tooltip>
</template>

<script>
export default {
	name: 'UiDevBadge',
};
</script>
