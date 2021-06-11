<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		bottom
		:open-delay="300"
	>
		<template #activator="{ on, attrs }">
			<div
				v-bind="attrs"
				v-on="on"
			>
				<v-btn
					class="px-4 white--text"
					color="primary"
					depressed
					small
					:alt="$t('query.input.run.alt')"
					:loading="isLoading"
					:disabled="isDisabled"
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
					<span
						v-if="numberOfQueries > 1"
						class="my-0 body-2"
						style="margin-top: 2px !important;"
					>
						<span class="ma-0 pa-0 overline text-center text-lowercase">
							x
						</span>
						<span class="ma-0 ml-n2 pa-0 body-2 text-lowercase">
							{{ numberOfQueries }}
						</span>
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
			</div>
		</template>
		<span
			v-if="isDisabled"
			class="body-2"
		>
			{{ $t('query.input.run.tooltipDisabled') }}
		</span>
		<span
			v-else
			class="body-2"
		>
			{{ $t(`query.input.run.tooltip${ numberOfQueries > 1 ? 'All' : ''}`) }}
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
		numberOfQueries: { type: [String, Number], default: 1 },
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
		isDisabled () {
			return this.isLoading || !this.query;
		},
	},
	methods: {
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>
