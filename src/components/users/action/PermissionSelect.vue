<template>
	<v-select
		v-model="value"
		class="ma-0 mt-3 mb-0 pa-0"
		:class="{
			'gray--text text--darken-3': !$vuetify.theme.dark,
			'gray--text text--lighten-4': $vuetify.theme.dark,
		}"
		color="bg"
		:items="items"
		:label="$t('users.modal.add.permission')"
	/>
</template>

<script>
export default {
	name: 'UsersActionPermissionSelect',
	props: {
		filter: { type: String, default: '' },
		initialValue: { type: [String, Number], default: '1' },
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
		initialValue: {
			immediate: true,
			handler (newVal) {
				newVal && (this.value = `${ newVal }`);
			},
		},
		value: {
			immediate: true,
			handler (newVal) {
				this.$emit('update', newVal);
			},
		},
	},
};
</script>
