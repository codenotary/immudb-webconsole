<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center-right"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				href="https://github.com/codenotary/immudb-webconsole/issues/new/choose"
				class="ma-0 pl-2 text-none d-flex white--text caption align-center elevation-2"
				color="primary"
				target="_blank"
				rel="noopener"
				small
				v-bind="attrs"
				v-on="on"
			>
				<v-icon
					:size="18"
				>
					{{ mdiCommentQuote }}
				</v-icon>
				<v-divider
					class="my-0 ml-2 pa-0"
					vertical
					style="border-color: rgba(255, 255, 255, 0.55);"
				/>
				<span
					class="ml-2 d-flex justify-start align-center"
				>
					{{ $t('footer.feedback.text') }}
				</span>
			</v-btn>
		</template>
		<span class="body-2">
			{{ $t('footer.feedback.tooltip') }}
		</span>
	</v-tooltip>
</template>

<script>
import {
	mdiCommentQuote,
} from '@mdi/js';

export default {
	name: 'UiActionFeedbackBtn',
	data () {
		return {
			mdiCommentQuote,
		};
	},
};
</script>
