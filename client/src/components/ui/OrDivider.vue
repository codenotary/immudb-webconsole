<template>
	<section class="or-divider">
		<v-row
			class="ma-0 justify-center align-center"
		>
			<v-col
				class="pa-0 justify-end align-center"
				cols="3" sm="2"
				md="2" lg="1"
			>
				<v-divider />
			</v-col>
			<v-col
				class="pa-0 px-4 justify-center align-center"
				cols="2" sm="1"
				md="1" lg="1"
			>
				<span class="bg overline font-300--text">
					{{ $t('common.or') }}
				</span>
			</v-col>
			<v-col
				class="pa-0 justify-start align-center"
				cols="3" sm="2"
				md="2" lg="1"
			>
				<v-divider />
			</v-col>
		</v-row>
	</section>
</template>

<script>
export default {
	name: 'UiOrDivider',
};
</script>

<style lang="scss">

.or-divider {
	position: relative;
}
</style>
