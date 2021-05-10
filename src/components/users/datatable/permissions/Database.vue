<template>
	<span
		class="ma-0 pa-0 caption"
	>
		<span
			v-if="value === '*'"
			class="font-weight-bold"
		>
			{{ $t('common.all') }} (*)
		</span>
		<span v-else>
			{{ value }}
		</span>
	</span>
</template>
<script>
export default {
	name: 'UsersDatatablePermissionDatabase',
	props: {
		value: { type: [String, Number], default: '' },
	},
};
</script>
