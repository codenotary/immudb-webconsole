<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-top-center"
		bottom
		:open-delay="300"
		:nudge-bottom="6"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				depressed
				small
				icon
				:alt="$t('query.input.clear')"
				:disabled="isLoading"
				v-bind="attrs"
				v-on="on"
				@click="onSubmit"
			>
				<v-icon
					class="title"
					:class="{
						'gray--text text--lighten-1': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
					}"
					:size="20"
				>
					{{ mdiBroom }}
				</v-icon>
			</v-btn>
		</template>
		<span class="body-2">
			{{ $t('query.input.clear') }}
		</span>
	</v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';

import {
	mdiBroom,
} from '@mdi/js';

export default {
	name: 'CodeActionReset',
	data () {
		return {
			mdiBroom,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
	},
	methods: {
		onSubmit () {
			this.$emit('reset');
		},
	},
};
</script>
