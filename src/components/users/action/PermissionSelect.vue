<template>
	<v-select
		v-model="value"
		class="ma-0 mt-3 mb-0 pa-0"
		:class="{
			'gray--text text--darken-1': !$vuetify.theme.dark,
			'gray--text text--lighten-1': $vuetify.theme.dark,
		}"
		color="grey darken-2"
		:items="items"
		:label="$t('users.modal.add.permission')"
	/>
</template>

<script>
export default {
	name: 'UsersActionPermissionSelect',
	props: {
		filter: { type: String, default: '' },
	},
	data () {
		return {
			value: '1',
			items: [
				{ text: 'admin', value: '254' },
				{ text: 'read', value: '1' },
				{ text: 'read & write', value: '2' },
			],
		};
	},
	watch: {
		value: {
			immediate: true,
			handler (newVal) {
				this.$emit('update', newVal);
			},
		},
	},
};
</script>
