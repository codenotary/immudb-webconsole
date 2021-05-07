<template>
	<v-tooltip
		bottom
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="px-4 primary-gradient white--text"
				color="blue"
				depressed
				small
				primary
				:alt="$t('users.add.alt')"
				:loading="isLoading"
				:disabled="isLoading"
				v-bind="attrs"
				v-on="on"
				@click="onSubmit"
			>
				<v-icon
					class="title"
				>
					{{ mdiAccountPlusOutline }}
				</v-icon>
				<span
					class="my-0 mx-2 body-2 text-capitalize"
				>
					{{ $t('users.add.button') }}
				</span>
				<template #loader>
					<v-progress-circular
						indeterminate
						color="white"
						:width="2"
						:size="16"
					/>
					<span class="ma-0 ml-2 pa-0 caption font-weight-bold">
						{{ $t('users.add.loading') }}
					</span>
				</template>
			</v-btn>
		</template>
		<span>
			{{ $t('users.add.tooltip') }}
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
	mdiAccountPlusOutline,
} from '@mdi/js';

export default {
	name: 'UsersActionAdd',
	data () {
		return {
			mdiAccountPlusOutline,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
	},
	methods: {
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>
