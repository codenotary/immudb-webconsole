<template>
	<v-tooltip
		bottom
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="px-4 primary-gradient white--text"
				color="blue"
				depressed
				small
				primary
				:alt="$t('code.run')"
				:loading="isLoading"
				:disabled="isLoading || !code"
				v-bind="attrs"
				v-on="on"
				@click="onSubmit"
			>
				<v-icon
					class="title"
				>
					{{ mdiPlay }}
				</v-icon>
				<span
					class="my-0 mx-2 body-2 text-capitalize"
				>
					{{ $t('common.run') }}
				</span>
				<template #loader>
					<v-progress-circular
						indeterminate
						color="white"
						:width="2"
						:size="16"
					/>
					<span class="ma-0 ml-2 pa-0 caption">
						{{ $t('common.running') }}
					</span>
				</template>
			</v-btn>
		</template>
		<span>
			{{ $t('code.run') }}
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
	mdiPlay,
} from '@mdi/js';

export default {
	name: 'CodeActionRun',
	props: {
		code: { type: String, default: '' },
	},
	data () {
		return {
			mdiPlay,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
	},
	methods: {
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>
