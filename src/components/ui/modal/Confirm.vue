<template>
	<v-dialog
		content-class="primary-outlined"
		:color="color"
		:value="value"
		max-width="600px"
		:overlay-opacity="0.55"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-0 bg">
			<v-card-title
				class="ma-0 mb-2 py-2 px-4 primary d-flex justify-start align-center"
				:color="color"
			>
				<slot name="icon">
					<v-icon
						class="bg--text"
						:size="20"
					>
						{{ mdiAlertCircleOutline }}
					</v-icon>
				</slot>
				<span
					class="ml-2 bg--text subtitle-1"
					style="width: calc(100% - 64px);"
				>
					{{ title }}
				</span>
				<v-spacer />
				<v-btn
					icon
					small
					@click="onClose"
				>
					<v-icon
						class="bg--text"
						:size="20"
					>
						{{ mdiClose }}
					</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text
				class="ma-0 pa-4"
				style="overflow-x: hidden !important;"
			>
				<slot>{{ text }}</slot>

				<v-form
					id="UiModalConfirmForm"
					@submit.prevent="onConfirm"
				/>
			</v-card-text>
			<v-card-actions class="ma-0 pa-4 pt-0 d-flex justify-center">
				<v-btn
					class="px-4"
					outlined
					color="primary"
					@click="onClose"
				>
					{{ cancelText || $t('common.cancel') }}
				</v-btn>
				<v-btn
					class="ml-2 px-4"
					color="primary"
					form="UiModalConfirmForm"
					@click="onConfirm"
				>
					{{ confirmText || $t('confirm') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import {
	mdiAlertCircleOutline,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'UiModalConfirm',
	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: '' },
		color: { type: String, default: 'primary' },
		text: { type: String, default: '' },
		confirmText: { type: String, default: '' },
		cancelText: { type: String, default: '' },
	},
	data () {
		return {
			mdiAlertCircleOutline,
			mdiClose,
		};
	},
	methods: {
		onClose () {
			this.$emit('input', false);
		},
		onConfirm() {
			this.$emit('confirm');
			this.$emit('input', false);
		},
	},
};
</script>
