<template>
	<v-autocomplete
		v-if="items && items.length"
		ref="snapshotSelector"
		v-model="value"
		:search-input.sync="search"
		class="snapshot-selector no-line"
		:style="`max-width: ${ getWidth }px;`"
		:height="30"
		:items="items"
		:label="$t('query.snapshot.label')"
		:placeholder="value"
		hide-details
		dense
		@change="onUpdate"
	/>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	IMMUDB_MODULE,
	STATE,
} from '@/store/immudb/constants';

export default {
	name: 'QueryActionsSelectTransaction',
	data () {
		return {
			items: [],
			value: '',
			search: '',
			filteredItems: this.items,
		};
	},
	computed: {
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
		}),
		getWidth () {
			if (this.value) {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				ctx.font = '16px Roboto';
				const { width } = ctx.measureText(this.value);
				return Math.max(144, width + 32);
			}
			return 144;
		},
		parsedItems () {
			return this.items
					.filter(({ text }) => {
						return !this.search ||
							(`${ text }` && `${ text }`.includes(this.search));
					});
		},
	},
	watch: {
		state: {
			deep: true,
			immediate: true,
			handler (newVal) {
				if (newVal) {
					const { txPresent } = newVal;
					if (txPresent) {
						const lastId = parseInt(txPresent);
						let items = [];
						for (let i = 1; i <= lastId; i++) {
							items = [...items, {
								text: i === lastId
									? `${ i } (${ this.$t('query.present') })`
									: `${ i }`,
								value: `${ i }`,
							}];
						}
						this.items = items;
						!this.value && (this.value = txPresent);
					}
				}
			},
		},
	},
	methods: {
		onUpdate (data) {
			this.$emit('update', data);
			this.$nextTick(() => {
				this.$refs.snapshotSelector.blur();
			});
		},
	},
};
</script>

<style lang="scss">
.snapshot-selector {
	margin-top: 0;
	top: 7px;

	.v-label {
		font-size: 0.85rem;
	}
}
</style>
