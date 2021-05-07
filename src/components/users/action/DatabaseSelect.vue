<template>
	<v-autocomplete
		ref="databaseSelector"
		v-model="value"
		class="ma-0 mt-3 mb-0 pa-0"
		:class="{
			'gray--text text--darken-1': !$vuetify.theme.dark,
			'gray--text text--lighten-1': $vuetify.theme.dark,
		}"
		color="grey darken-2"
		:items="parsedItems"
		:label="$t('users.modal.add.database')"
	/>
</template>

<script>
export default {
	name: 'UsersActionDatabaseSelect',
	props: {
		filter: { type: String, default: '' },
		databaseList: { type: Array, default: () => [] },
	},
	data () {
		return {
			value: 'defaultdb',
		};
	},
	computed: {
		parsedItems () {
			console.log(this.databaseList);
			if (this.databaseList && this.databaseList.length) {
				return this.databaseList.map((_) => {
					return {
						text: _ && _.databaseName,
						value: _ && _.databaseName,
					};
				});
			}
			return [];
		},
	},
	watch: {
		value (newVal) {
			this.$emit('update', newVal);
		},
	},
};
</script>
