<template>
	<v-card
		id="QueryOutput"
		class="ma-0 pa-0 bg shadow fill-height"
		elevation="0"
	>
		<v-card-title class="ma-0 pa-0 d-flex justify-start align-center">
			<QueryOutputSubNavbar
				:tab.sync="tab"
				:tab-has-updates.sync="tabHasUpdates"
			/>
		</v-card-title>
		<v-card-text
			ref="outputList"
			class="ma-0 pa-2 bg-secondary custom-scrollbar"
		>
			<QueryOutputGrid
				v-if="tab === 0"
				class="ma-0 pa-0"
				:empty-message="'query.output.grid.empty'"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import {
	OUTPUT_MODULE,
	CODE_OUTPUT,
} from '@/store/output/constants';
import { mdiViewList } from '@mdi/js';
const isEqual = require('lodash.isequal');

export default {
	name: 'QueryOutput',
	data () {
		return {
			mdiViewList,
			tab: 0,
			tabHasUpdates: [0, 0],
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			output: CODE_OUTPUT,
		}),
	},
	watch: {
		output: {
			deep: true,
			handler (newVal, oldVal) {
				if (this.tab !== 0 && !isEqual(newVal, oldVal)) {
					Vue.set(this.tabHasUpdates, 0, this.tabHasUpdates[0] + 1);
				}
				this.onScrollToBottom();
			},
		},
	},
	methods: {
		onScrollToBottom () {
			// scroll to latest row
			const { outputList } = this.$refs || {};
			if (outputList) {
				this.$nextTick(() => {
					outputList.scrollTop = outputList.scrollHeight;
				});
			}
		},
	},
};
</script>

<style lang="scss">
#QueryOutput {
	&.v-card {
		.v-card__title {
			height: 80px;
		}

		.v-card__text {
			height: calc(100% - 80px) !important;
			margin-top: 0 !important;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}
}
</style>
