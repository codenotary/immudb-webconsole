<template>
	<v-dialog
		class="confirm-modal-with-input"
		:color="color"
		:value="value"
		max-width="600px"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-4">
			<v-card-title
				class="ma-0 mb-2 pa-0"
				:color="color"
			>
				<slot name="icon">
					<v-icon
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
						}"
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
			</v-card-title>
			<v-card-text class="ma-0 mb-2 pa-0">
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
							:rules="`required|is:${ confirmValidator }`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.confirm"
								:error-messages="errors"
								class="text-field--fill"
								label="Source"
								:placeholder="placeholder"
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
	is,
} from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';
import {
	mdiAlertCircleOutline,
	mdiEye,
	mdiEyeOff,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

extend('is', {
	...is,
	message: 'This field must be equal to {other}',
});

setInteractionMode('eager');

export default {
	name: 'UiModalConfirmWithEqualInput',
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: '' },
		color: { type: String, default: 'error' },
		text: { type: String, default: '' },
		inputType: { type: String, default: 'text' },
		confirmValidator: { type: String, default: '' },
		placeholder: { type: String, default: '' },
		confirmValidatorError: { type: String, default: 'The field does not match the above mentioned requirements.' },
		confirmText: { type: String, default: '' },
		cancelText: { type: String, default: '' },
	},
	data() {
		return {
			mdiAlertCircleOutline,
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
