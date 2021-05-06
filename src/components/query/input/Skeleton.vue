<template>
	<div>
		<v-skeleton-loader
			class="ma-0 mb-4 pa-0"
			width="40%"
			:height="32"
			type="image"
		/>
		<v-skeleton-loader
			class="ma-0 mb-4 pa-0"
			width="80%"
			:height="64"
			type="image"
		/>
		<v-skeleton-loader
			class="ma-0 mb-4 pa-0"
			width="60%"
			:height="32"
			type="image"
		/>
	</div>
</template>

<script>
export default {
	name: 'QueryInputSkeleton',
};
</script>
