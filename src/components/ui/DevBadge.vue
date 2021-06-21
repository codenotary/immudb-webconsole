<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<span
				class="ma-0 pa-0 d-flex justify-center align-center"
				v-bind="attrs"
				v-on="on"
			>
				<v-chip
					class="ma-0 py-0 px-2 caption text-uppercase font-weight-bold elevation-2 rounded-1"
					color="accent"
					style="height: 28px;"
				>
					{{ $t('footer.devMode.label') }}
				</v-chip>
			</span>
		</template>
		<span class="body-2">
			{{ $t('footer.devMode.tooltip') }}
		</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'UiDevBadge',
};
</script>
