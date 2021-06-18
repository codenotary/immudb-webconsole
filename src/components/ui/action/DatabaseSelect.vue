<template>
	<span
		class="db-selector-wrapper ma-0 pa-0"
		:class="{
			'dense': dense,
		}"
	>
		<v-autocomplete
			v-if="parsedItems && parsedItems.length > 0"
			ref="databaseSelector"
			v-model="value"
			class="db-selector ma-0 pa-0 bg d-flex justify-start align-baseline"
			:class="{
				'gray--text text--lighten-1': !$vuetify.theme.dark,
				'gray--text text--lighten-4': $vuetify.theme.dark,
				'mt-3': !dense,
				'no-line': dense,
			}"
			:style="`width: ${getWidth} !important;`"
			:disabled="disabled"
			color="primary"
			:dense="dense"
			:hide-details="dense"
			:items="parsedItems"
			:label="!dense
				? $t('users.modal.add.database')
				: ''
			"
		>
			<template
				v-if="prepend"
				#prepend
			>
				<slot name="prepend">
					<span
						class="prepend ma-0 pa-0 subtitle-2 font-weight-bold"
						:class="{
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
						}"
						:style="`width: ${getPrependWidth}px !important;`"
					>
						{{ prepend }}
					</span>
				</slot>
			</template>
			<template #append>
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
	DEFAULT_DB,
} from '@/store/database/constants';

export default {
	name: 'UiActionDatabaseSelect',
	props: {
		filter: { type: String, default: '' },
		all: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		dense: { type: Boolean, default: false },
		initialValue: { type: String, default: DEFAULT_DB },
		prepend: { type: String, default: '' },
	},
	data () {
		return {
			value: DEFAULT_DB,
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
		getPrependWidth () {
			if (this.prepend) {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				ctx.font = '12.5px Roboto';
				const { width } = ctx.measureText(this.prepend);
				return width + 4;
			}
			else {
				return '100%';
			}
		},
		getWidth () {
			if (this.dense && this.value) {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				ctx.font = '14px Roboto';
				const { width } = ctx.measureText(this.value);
				return `${ this.getPrependWidth + width + 36 }px`;
			}
			else if (this.dense) {
				return '100px';
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
.db-selector-wrapper {
	&.dense {
		.db-selector {
			input {
				padding-top: 2px !important;
				color: var(--v-primary-base);
			}

			.v-input__append-inner {
				padding-left: 0;
				margin-left: -$spacer-2;
			}
		}
	}

	.db-selector {
		max-width: 100%;
		width: auto;

		input {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--v-primary-base);
		}

		.v-input__append-inner span {
			color: var(--v-primary-base) !important;
		}

		.prepend,
		.append {
			min-width: $spacer-14;
		}
	}
}

</style>
