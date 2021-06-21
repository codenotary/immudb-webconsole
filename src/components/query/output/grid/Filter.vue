<template>
	<v-select
		id="OutputFilter"
		v-model="value"
		class="ma-0 mt-1 pa-0"
		:class="{
			'gray--text text--lighten-1': !$vuetify.theme.dark,
			'gray--text text--lighten-4': $vuetify.theme.dark,
		}"
		:menu-props="{
			'content-class': 'arrow-top-right',
			'margin-top': 48,
			'bottom': true,
			'offset-y': true,
		}"
		:items="items"
		:label="$t('query.output.filter.label')"
		hide-details
		dense
	/>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	OUTPUT_MODULE,
	SET_FILTER,
	FILTER,
} from '@/store/output/constants';

export default {
	name: 'QueryOutputGridFilter',
	data () {
		return {
			value: '',
			items: ['all', 'stdtable', 'stderr'],
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			filter: FILTER,
		}),
	},
	watch: {
		filter: {
			immediate: true,
			handler (newVal, oldVal) {
				if (newVal !== oldVal) {
					this.value = newVal;
				}
			},
		},
		value (newVal) {
			this.setFilter(newVal);
		},
	},
	methods: {
		...mapActions(OUTPUT_MODULE, {
			setFilter: SET_FILTER,
		}),
	},
};
</script>

<style lang="scss">
#OutputFilter {
	width: $spacer-20;
	max-width: $spacer-20;
	z-index: 10;
}
</style>
