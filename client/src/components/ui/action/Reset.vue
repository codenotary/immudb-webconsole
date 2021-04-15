<template>
	<v-tooltip
		bottom
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				depressed
				small
				icon
				:alt="$t('code.reset')"
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
					{{ mdiDeleteOutline }}
				</v-icon>
			</v-btn>
		</template>
		<span>
			{{ $t('common.reset.button') }}
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
	mdiDeleteOutline,
} from '@mdi/js';

export default {
	name: 'CodeActionReset',
	data () {
		return {
			mdiDeleteOutline,
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
