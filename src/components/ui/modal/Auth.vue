<template>
	<v-dialog
		content-class="primary-outlined"
		max-width="600px"
		:color="'primary'"
		:value="value"
		persistent
		:overlay-opacity="0.55"
	>
		<v-card class="ma-0 pa-0 bg">
			<v-card-title class="ma-0 mb-2 py-2 px-4 primary d-flex justify-start align-center">
				<v-icon
					class="bg--text"

					:size="20"
				>
					{{ mdiLocationEnter }}
				</v-icon>
				<span class="ml-2 bg--text subtitle-1">
					{{ $t('login.title') }}
				</span>
			</v-card-title>
			<v-card-text
				class="ma-0 mb-2 pa-4 pt-2"
				style="overflow-x: hidden !important;"
			>
				<ValidationObserver
					ref="observer"
					v-slot="{ validate }"
				>
					<v-form
						v-if="form"
						id="LoginForm"
						class="ma-0 pa-0"
						@submit.prevent="validate().then(onLogin)"
					>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.user"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('login.label.username')"
								:placeholder="$t('login.placeholder.username')"
								autofocus
								required
								type="text"
								@click:append="show = !show"
							/>
						</ValidationProvider>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.password"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('login.label.password')"
								:placeholder="$t('login.placeholder.password')"
								required
								:type="show ? 'text' : 'password'"
								:append-icon="show ? mdiEye : mdiEyeOff"
								@click:append="show = !show"
							/>
						</ValidationProvider>
					</v-form>
				</ValidationObserver>
			</v-card-text>
			<v-card-actions class="ma-0 pa-4 d-flex justify-center">
				<v-btn
					class="px-4"
					color="primary"
					form="LoginForm"
					type="submit"
				>
					{{ $t('login.submit') }}
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
	mdiLocationEnter,
	mdiEye,
	mdiEyeOff,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

setInteractionMode('eager');

export default {
	name: 'UiModalFreezePatch',
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	props: {
		value: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiLocationEnter,
			mdiEye,
			mdiEyeOff,
			show: false,
			form: {
				user: '',
				password: '',
			},
		};
	},
	watch: {
		value (newVal) {
			this.form = {
				user: '',
				password: '',
			};
			this.$nextTick(() => {
				const { observer } = this.$refs;
				observer && observer.reset();
			});
		},
	},
	methods: {
		onLogin () {
			this.$emit('submit', {
				user: this.form.user,
				password: this.form.password,
			});
			this.$emit('input', false);
		},
	},
};
</script>
