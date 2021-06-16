<template>
	<v-card
		v-if="data"
		class="metrics-card metrics-counter-card ma-0 pa-4 bg fill-width"
		elevation="4"
	>
		<v-card-title class="ma-0 pa-0 d-flex justify-center align-center">
			<span
				class="ma-0 pa-0 subtitle-2 text-center font-weight-bold"
				:class="{
					'gray--text text--lighten-1': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
			>
				{{ title }}
			</span>
		</v-card-title>
		<v-divider
			class="mx-auto my-4 pa-0"
			inset
		/>
		<v-card-text
			class="ma-0 pa-0 fill-width d-flex justify-center align-center"
		>
			<span
				class="ma-0 pa-0 title font-weight-regular"
				:class="{
					'gray--text text--darken-3': !$vuetify.theme.dark,
					'gray--text text--lighten-5': $vuetify.theme.dark,
				}"
			>
				{{ value }}
			</span>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	THEME,
	MOBILE,
} from '@/store/view/constants';
import {
	mdiInformationOutline,
} from '@mdi/js';

export default {
	name: 'Counter',
	props: {
		data: { type: Object, default: () => {} },
	},
	data () {
		return {
			mdiInformationOutline,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			theme: THEME,
			mobile: MOBILE,
		}),
		noData () {
			return !this.value;
		},
		title () {
			if (this.data) {
				const { title } = this.data;
				return title;
			}
			return '';
		},
		value () {
			if (this.data) {
				const { value } = this.data;
				return value;
			}
			return '';
		},
	},
};
</script>

<style lang="scss">
.metrics-card {
	.stack-sheet {
		position: relative;
		min-height: 208px;
		height: auto;
	}

	.stack-spark {
		position: absolute;
		top: 0;
		left: 0;
	}

	> div {
		height: inherit;
	}

	.chart-no-data {
		position: absolute;
		height: 32px;
		width: 160px;
		top: calc(170px - 8px);
		left: calc(50% - 80px);
	}
}
</style>
