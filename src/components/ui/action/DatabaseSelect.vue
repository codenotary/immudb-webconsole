<template>
	<span class="ma-0 pa-0 fill-width">
		<v-autocomplete
			v-if="parsedItems && parsedItems.length > 0"
			ref="databaseSelector"
			v-model="value"
			class="database-selector ma-0 pa-0 d-flex justify-start align-center"
			:class="{
				'gray--text text--darken-1': !$vuetify.theme.dark,
				'gray--text text--lighten-1': $vuetify.theme.dark,
				'mt-3': !dense,
				'dense': dense,
				'no-line': dense,
			}"
			:style="`width: ${getWidth} !important;`"
			:disabled="disabled"
			color="grey darken-2"
			:dense="dense"
			:hide-details="dense"
			:items="parsedItems"
			:label="!dense
				? $t('users.modal.add.database')
				: ''
			"
		>
			<template #append-outer>
				<slot name="append-outer" />
			</template>
		</v-autocomplete>
		<v-skeleton-loader
			v-else
			class="ma-0 ml-2 pa-0"
			style="width: calc(100% - 32px);"
			:height="24"
			type="image"
		/>
	</span>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	DATABASE_MODULE,
	DATABASE_LIST,
} from '@/store/database/constants';

export default {
	name: 'UiActionDatabaseSelect',
	props: {
		filter: { type: String, default: '' },
		all: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		dense: { type: Boolean, default: false },
		initialValue: { type: String, default: 'defaultdb' },
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
			let parsed = [];
			if (this.all) {
				parsed = [
					...parsed,
					{ text: 'All', value: '*' },
				];
			}
			if (this.databaseList && this.databaseList.length) {
				parsed = [
					...parsed,
					...this.databaseList.map((_) => {
						return {
							text: _ && _.databaseName,
							value: _ && _.databaseName,
						};
					}),
				];
			}
			return parsed;
		},
		getWidth () {
			if (this.dense && this.value) {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				ctx.font = '16px Roboto';
				const { width } = ctx.measureText(this.value);
				return `${ width + 32 }px`;
			}
			else if (this.dense) {
				return '144px';
			}
			else {
				return '100%';
			}
		},
	},
	watch: {
		initialValue: {
			immediate: true,
			handler (newVal) {
				newVal && (this.value = newVal);
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

<style lang="scss">
.database-selector {
	&.dense {
		max-width: calc(100% - #{ $spacer-8 });
	}

	span.append-outer {
		width: $spacer-16;
	}
}
</style>
