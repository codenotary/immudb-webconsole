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
					class="ma-0 ml-2 pa-0"
					style="width: calc(100% - 64px);"
				>
					{{ title }}
				</span>
				<v-spacer />
				<v-btn
					icon
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
				class="ma-0 mb-2 pa-4 pt-2"
				style="overflow-x: hidden !important;"
			>
				<slot>{{ text }}</slot>

				<ValidationObserver
					ref="observer"
					v-slot="{ validate }"
				>
					<v-form
						v-if="form"
						id="UiModalConfirmFormWithInput"
						class="ma-0 pa-0"
						@submit.prevent="validate().then(onConfirm)"
					>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.confirm"
								:error-messages="errors"
								class="text-field--fill"
								:label="placeholder"
								autofocus
								required
								:type="inputType === 'password' && !show ? 'password' : 'text'"
								:append-icon="inputType === 'password' ? (show ? mdiEye : mdiEyeOff) : ''"
								@click:append="show = !show"
							/>
						</ValidationProvider>
					</v-form>
				</ValidationObserver>
			</v-card-text>
			<v-card-actions class="ma-0 pa-4 d-flex justify-center">
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
					form="UiModalConfirmFormWithInput"
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
	required,
} from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';
import {
	mdiAlertCircleOutline,
	mdiClose,
	mdiEye,
	mdiEyeOff,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

setInteractionMode('eager');

export default {
	name: 'UiModalConfirmWithInput',
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: '' },
		color: { type: String, default: 'primary' },
		text: { type: String, default: '' },
		inputType: { type: String, default: 'text' },
		placeholder: { type: String, default: '' },
		confirmText: { type: String, default: '' },
		cancelText: { type: String, default: '' },
	},
	data() {
		return {
			mdiAlertCircleOutline,
			mdiClose,
			mdiEye,
			mdiEyeOff,
			show: false,
			form: {
				confirm: '',
			},
		};
	},
	watch: {
		value (newVal) {
			if (!newVal) {
				this.form && (this.form.confirm = '');
			}
		},
	},
	methods: {
		async onConfirm() {
			const valid = await this.$refs.observer.validate();

			if (valid) {
				this.$emit('confirm', this.form.confirm);
				this.$emit('input', false);
			}
		},
		onClose () {
			this.$emit('input', false);
		},
	},
};
</script>
