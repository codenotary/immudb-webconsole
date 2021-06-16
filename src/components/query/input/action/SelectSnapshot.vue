<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		bottom
		:open-delay="300"
	>
		<template #activator="{ on, attrs }">
			<div
				class="ma-0 pa-0 d-flex flex-wrap justify-start align-center"
				v-bind="attrs"
				v-on="on"
			>
				<v-icon
					:class="{
						'gray--text text--lighten-2': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
					}"
					dense
					:size="24"
				>
					{{ mdiHistory }}
				</v-icon>
				<v-autocomplete
					v-if="items && items.length"
					ref="snapshotSelector"
					v-model="value"
					:search-input.sync="search"
					class="snapshot-selector body-2 font-weight-bold no-line ml-3"
					:style="`max-width: ${ getWidth }px;`"
					:height="30"
					:items="items"
					:label="$t('query.input.snapshot.label')"
					:placeholder="value"
					hide-details
					dense
					:disabled="true"
					@change="onUpdate"
				/>
			</div>
		</template>
		<span class="body-2">
			{{ $t('query.input.timetravelComingSoon') }}
		</span>
	</v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	IMMUDB_MODULE,
	STATE,
} from '@/store/immudb/constants';
import {
	mdiHistory,
} from '@mdi/js';

export default {
	name: 'QueryInputActionsSelectTransaction',
	data () {
		return {
			mdiHistory,
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
				ctx.font = '14px Roboto';
				const { width } = ctx.measureText(this.value);
				return Math.max(96, width + 32 + 32);
			}
			return 96;
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
									? `${ i } (${ this.$t('query.input.present') })`
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
