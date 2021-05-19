<template>
	<div
		v-if="value"
		class="d-flex align-center"
	>
		{{ parsedDate }}
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	TIMEZONE,
} from '@/store/view/constants';
import moment from 'moment';

export default {
	name: 'UiColumnsDate',
	props: {
		value: { type: String, default: '' },
		format: { type: String, default: 'YYYY/MM/DD hh:mm A' },
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			tz: TIMEZONE,
		}),
		parsedDate () {
			if (this.value) {
				const value = this.value.split('.')[0];
				if (this.tz === 'utc') {
					return moment
							.utc(value)
							.format(this.format);
				}
				else {
					return moment
							.utc(value)
							.local()
							.format(this.format);
				}
			}
			return '';
		},
	},
};
</script>
