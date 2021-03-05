<template>
	<v-tooltip
		bottom
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="primary-gradient"
				color="blue"
				depressed
				small
				primary
				:loading="isLoading"
				v-bind="attrs"
				v-on="on"
				@click="onSubmit"
			>
				<v-icon
					class="title"
					color="white darken-1"
				>
					{{ mdiPlay }}
				</v-icon>
				<span class="mx-2 body-2 text-capitalize">
					{{ $t('common.run') }}
				</span>
			</v-btn>
		</template>
		<span>
			{{ $t('code.run') }}
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
	mdiPlay,
} from '@mdi/js';

export default {
	name: 'CodeRun',
	data () {
		return {
			mdiPlay,
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
