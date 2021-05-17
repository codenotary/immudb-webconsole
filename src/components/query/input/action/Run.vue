<template>
	<v-tooltip
		bottom
		:open-delay="300"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				class="px-4 success-gradient white--text"
				color="blue"
				depressed
				small
				primary
				:alt="$t('query.input.run.alt')"
				:loading="isLoading"
				:disabled="isLoading || !query"
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
					style="margin-top: 2px !important;"
				>
					{{ $t('query.input.run.button') }}
				</span>
				<template #loader>
					<v-progress-circular
						indeterminate
						color="white"
						:width="2"
						:size="16"
					/>
					<span class="ma-0 ml-2 pa-0 caption">
						{{ $t('query.input.run.loading') }}
					</span>
				</template>
			</v-btn>
		</template>
		<span>
			{{ $t('query.input.run.tooltip') }}
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
	name: 'QueryInputActionRun',
	props: {
		query: { type: String, default: '' },
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
