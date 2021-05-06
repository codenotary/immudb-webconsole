<template>
	<v-dialog
		class="confirm-modal"
		:color="color"
		:value="value"
		max-width="600px"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-4">
			<v-card-title
				class="ma-0 mb-4 pa-0"
				:color="color"
			>
				<v-icon
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiAlertCircleOutline }}
				</v-icon>
				<strong
					class="ma-0 ml-4 pa-0"
					style="width: calc(100% - 64px);"
				>
					{{ title }}
				</strong>
			</v-card-title>
			<v-card-text class="ma-0 pa-0">
				<slot>{{ text }}</slot>

				<v-form
					id="UiModalConfirmForm"
					@submit.prevent="onConfirm"
				/>
			</v-card-text>
			<v-card-actions class="ma-0 pa-0 pt-4 d-flex justify-end">
				<v-btn
					text
					@click="onClose"
				>
					{{ cancelText || $t('cancel') }}
				</v-btn>
				<v-btn
					:class="`ml-2 ${ color }-gradient`"
					:color="color"
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
} from '@mdi/js';

export default {
	name: 'UiModalConfirm',
	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: '' },
		color: { type: String, default: 'error' },
		text: { type: String, default: '' },
		confirmText: { type: String, default: '' },
		cancelText: { type: String, default: '' },
	},
	data () {
		return {
			mdiAlertCircleOutline,
		};
	},
	methods: {
		onConfirm() {
			this.$emit('confirm');
			this.$emit('input', false);
		},
		onClose () {
			this.$emit('input', false);
		},
	},
};
</script>
