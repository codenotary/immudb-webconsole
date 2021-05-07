<template>
	<v-chip
		class="ma-0 py-0 px-2 caption"
		style="margin-top: 2px !important;"
		:color="color"
		small
		dense
	>
		{{ value }}
	</v-chip>
</template>

<script>
export default {
	name: 'UiColumnsBadge',
	props: {
		value: { type: [String, Boolean], default: '' },
		color: { type: String, default: 'accent' },
	},
};
</script>
