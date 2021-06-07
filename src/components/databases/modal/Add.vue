<template>
	<v-dialog
		class="database-type-modal"
		:value="value"
		max-width="600px"
		persistent
		:overlay-opacity="0.95"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-4 bg">
			<v-card-title class="ma-0 mb-2 pa-0">
				<v-icon
					:class="{
						'black--text ': !$vuetify.theme.dark,
						'white--text': $vuetify.theme.dark,
					}"
				>
					{{ mdiDatabasePlusOutline }}
				</v-icon>
				<span class="ml-2">
					{{ $t('databases.action.add.title', { user }) }}
				</span>
				<v-spacer />
				<v-btn
					icon
					small
					@click="onClose"
				>
					<v-icon
						:class="{
							'black--text ': !$vuetify.theme.dark,
							'white--text': $vuetify.theme.dark,
						}"
						:size="20"
					>
						{{ mdiClose }}
					</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text
				class="ma-0 mb-2 pa-0"
				style="overflow-x: hidden !important;"
			>
				<ValidationObserver
					ref="observer"
					v-slot="{ validate }"
				>
					<v-form
						v-if="form"
						id="AddDatabaseForm"
						class="ma-0 pa-0"
						@submit.prevent="validate().then(onSubmit)"
					>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.databaseName"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('databases.modal.add.databaseName')"
								:placeholder="$t('databases.modal.add.databaseName')"
								autofocus
								required
								type="text"
							/>
						</ValidationProvider>
					</v-form>
				</ValidationObserver>
			</v-card-text>
			<v-card-actions class="ma-0 pa-0 d-flex justify-end">
				<v-btn
					text
					@click="$emit('input', false)"
				>
					{{ $t('common.cancel') }}
				</v-btn>
				<v-btn
					class="ma-0 ml-2 py-0 px-2 success-gradient"
					color="success"
					type="submit"
					form="AddDatabaseForm"
				>
					{{ $t('common.confirm') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { required } from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';
import {
	mdiDatabasePlusOutline,
	mdiClose,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

extend('strong_password', {
	validate: _ => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(_),
	message: field => 'The ' + field + ' must contain at least 1 uppercase letter, 1 digit and 1 special character.',
});

setInteractionMode('eager');

export default {
	name: 'DatabaseModalAdd',
	components: {
		ValidationProvider,
		ValidationObserver,
	},
	props: {
		user: { type: String, default: '' },
		value: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiDatabasePlusOutline,
			mdiClose,
			show: false,
			form: {
				databaseName: '',
			},
		};
	},
	watch: {
		value (newVal) {
			this.form = {
				databaseName: '',
			};
			this.$nextTick(() => {
				const { observer } = this.$refs;
				observer && observer.reset();
			});
		},
	},
	methods: {
		onClose () {
			this.$emit('input', false);
		},
		async onSubmit() {
			const valid = await this.$refs.observer.validate();

			if (valid) {
				this.$emit('submit', {
					databaseName: this.form.databaseName,
				});
				this.$emit('input', false);
			}
		},
	},
};
</script>

<style lang="scss">
.database-type-modal {
	.body {
		display: flex;
		align-items: center;
		flex: 1;
		padding-top: $spacer * 1.5 !important;
		padding-bottom: $spacer * 1.5 !important;

		.icon {
			flex: 0;
			font-size: 32px;
			color: $error;
		}

		.content {
			padding-top: 0 !important;
			width: 100%;
		}
	}

	.footer {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
