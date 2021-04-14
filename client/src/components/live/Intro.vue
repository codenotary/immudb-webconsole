<template>
	<span
		class="live-intro ma-0 mb-4 pa-0 pb-4"
		v-html="sanitizeIntro"
	/>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	LIVE_MODULE,
	INTRO,
} from '@/store/live/constants';

export default {
	name: 'LiveIntro',
	computed: {
		...mapGetters(LIVE_MODULE, {
			intro: INTRO,
		}),
		sanitizeIntro () {
			if (this.intro) {
				const { value } = this.intro;
				return value;
			}
			return '';
		},
	},
};
</script>
