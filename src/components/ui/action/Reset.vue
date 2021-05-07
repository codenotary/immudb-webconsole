<template>
	<v-tooltip
		bottom
		:open-delay="300"
	>
		<template v-slot:activator="{ on, attrs }">
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
						'gray--text text--darken-2': !$vuetify.theme.dark,
						'gray--text text--lighten-2': $vuetify.theme.dark,
					}"
				>
					{{ mdiBroom }}
				</v-icon>
			</v-btn>
		</template>
		<span>
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
