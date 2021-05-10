<template>
	<v-autocomplete
		ref="databaseSelector"
		v-model="value"
		class="ma-0 mt-3 mb-0 pa-0"
		:class="{
			'gray--text text--darken-1': !$vuetify.theme.dark,
			'gray--text text--lighten-1': $vuetify.theme.dark,
		}"
		:disabled="disabled"
		color="grey darken-2"
		:items="parsedItems"
		:label="$t('users.modal.add.database')"
	/>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	DATABASE_MODULE,
	DATABASE_LIST,
} from '@/store/database/constants';

export default {
	name: 'UsersActionDatabaseSelect',
	props: {
		filter: { type: String, default: '' },
		disabled: { type: Boolean, default: false },
	},
	data () {
		return {
			value: 'defaultdb',
		};
	},
	computed: {
		...mapGetters(DATABASE_MODULE, {
			databaseList: DATABASE_LIST,
		}),
		parsedItems () {
			if (this.databaseList && this.databaseList.length) {
				return [
					{ text: this.$t('common.all'), value: '*' },
					...this.databaseList.map((_) => {
						return {
							text: _ && _.databaseName,
							value: _ && _.databaseName,
						};
					}),
				];
			}
			return [{ text: this.$t('common.all'), value: '*' }];
		},
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
