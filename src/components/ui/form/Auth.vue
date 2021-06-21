<template>
	<v-card
		class="ma-0 pa-4 bg-transparent fill-width"
		elevation="0"
	>
		<v-card-title class="ma-0 mb-6 pa-0">
			<v-row class="ma-0 pa-0 d-flex flex-column justify-center align-center">
				<v-col
					class="ma-0 pa-0 d-flex justify-center align-center"
					cols="12"
				>
					<span class="ml-2 title font-weight-regular">
						{{ $t('login.subtitle') }}
					</span>
				</v-col>
			</v-row>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0"
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
						name="user"
						:rules="`required`"
						mode="aggressive"
						:debounce="300"
					>
						<v-text-field
							v-model="form.user"
							:error-messages="errors"
							class="mb-2 text-field--fill"
							height="48"
							elevation="4"
							:light="!$vuetify.theme.dark"
							:dark="$vuetify.theme.dark"
							:label="$t('login.label.username')"
							:placeholder="$t('login.placeholder.username')"
							:hint="isPlublicDemo
								? $t('login.hint.username')
								: undefined
							"
							:persistent-hint="isPlublicDemo"
							autofocus
							required
							solo
							type="text"
							@click:append="show = !show"
							@focus="onResetErrors"
						/>
					</ValidationProvider>
					<ValidationProvider
						v-slot="{ errors }"
						name="password"
						:rules="`required`"
						mode="aggressive"
						:debounce="300"
					>
						<v-text-field
							v-model="form.password"
							:error-messages="errors"
							class="mb-2 text-field--fill"
							height="48"
							elevation="4"
							:light="!$vuetify.theme.dark"
							:dark="$vuetify.theme.dark"
							:label="$t('login.label.password')"
							:placeholder="$t('login.placeholder.password')"
							:hint="isPlublicDemo
								? $t('login.hint.password')
								: undefined
							"
							:persistent-hint="isPlublicDemo"
							required
							solo
							:type="show ? 'text' : 'password'"
							:append-icon="show ? mdiEye : mdiEyeOff"
							@click:append="show = !show"
							@focus="onResetErrors"
						/>
					</ValidationProvider>
				</v-form>
			</ValidationObserver>
		</v-card-text>
		<v-card-actions class="ma-0 pa-0 d-flex justify-center">
			<v-btn
				class="px-8 elevation-4"
				color="primary"
				form="LoginForm"
				type="submit"
				large
				height="48"
			>
				<span
					class="ma-0 text-capitalize subtitle-1"
				>
					{{ $t('login.submit') }}
				</span>
			</v-btn>
		</v-card-actions>
	</v-card>
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
	computed: {
		isPlublicDemo () {
			return !!process.env.IS_PUBLIC_DEMO;
		},
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
		onResetErrors () {
			this.$refs.observer.reset();
		},
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

<style lang="scss">
#LoginForm {
	.v-input {
		&.theme-- {
			&light,
			&dark {
				.v-input__slot {
					background-color: #fff !important;

					label,
					::placeholder {
						color: #555;
					}

					.v-icon,
					input {
						color: #0e0e0e;
					}
				}
			}
		}
	}
}
</style>
