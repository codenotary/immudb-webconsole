<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		bottom
		:open-delay="300"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				class="px-4 white--text d-flex align-center"
				color="primary"
				depressed
				small
				primary
				:alt="$t('databases.action.add.alt')"
				:loading="isLoading"
				:disabled="isLoading"
				v-bind="attrs"
				v-on="on"
				@click="onSubmit"
			>
				<v-icon
					class="title"
					:size="20"
				>
					{{ mdiDatabaseCogOutline }}
				</v-icon>
				<span
					class="my-0 mx-2 body-2 text-capitalize d-flex align-center"
					style="margin-top: 2px !important;"
				>
					{{ $t('databases.action.add.button') }}
				</span>
				<template #loader>
					<v-progress-circular
						indeterminate
						color="white"
						:width="2"
						:size="16"
					/>
					<span class="ma-0 ml-2 pa-0 caption font-weight-bold">
						{{ $t('common.loading') }}
					</span>
				</template>
			</v-btn>
		</template>
		<span class="body-2">
			{{ $t('databases.action.add.tooltip') }}
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
	mdiDatabaseCogOutline,
} from '@mdi/js';

export default {
	name: 'DatabasesActionAdd',
	data () {
		return {
			mdiDatabaseCogOutline,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
	},
	methods: {
		onClose () {
			this.$emit('input', false);
		},
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>
