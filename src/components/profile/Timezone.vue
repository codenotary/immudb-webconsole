<template>
	<div class="ma-0 pa-0 bg d-flex flex-column justify-center align-center fill-width">
		<span class="my-2 mx-0 pa-0 subtitle-2">
			{{ $t('profile.timezone.label') }}
			<v-tooltip
				content-class="ma-0 py-2 px-4 bg primary-outlined"
				right
				:open-delay="300"
			>
				<template #activator="{ on, attrs }">
					<v-icon
						class="ma-0 ml-1 pa-0"
						color="primary"
						style="margin-top: -2px !important;"
						:size="14"
						v-bind="attrs"
						v-on="on"
					>
						{{ mdiInformationOutline }}
					</v-icon>
				</template>
				<span>
					{{ $t('profile.timezone.tooltip') }}
				</span>
			</v-tooltip>
		</span>
		<v-btn-toggle
			:value="timezone"
			class="ma-0 pa-0 bg elevation-2 primary-outlined-thin"
			color="primary"
			dense
			@change="onTimezoneChange"
		>
			<v-btn
				class="white--text"
				:class="{
					'primary': timezone === LOCAL,
					'white': timezone !== LOCAL,
					'white--text': timezone === LOCAL,
					'primary--text': timezone !== LOCAL,
				}"
				:value="LOCAL"
				small
			>
				{{ LOCAL }}
			</v-btn>
			<v-btn
				class="white--text"
				:class="{
					'primary': timezone === UTC,
					'white': timezone !== UTC,
					'white--text': timezone === UTC,
					'primary--text': timezone !== UTC,
				}"
				:value="UTC"
				small
			>
				{{ UTC }}
			</v-btn>
		</v-btn-toggle>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_TIMEZONE,
	TIMEZONE,
} from '@/store/view/constants';
import {
	mdiInformationOutline,
} from '@mdi/js';

const UTC = 'utc';
const LOCAL = 'local';

export default {
	name: 'ProfileTimezone',
	data () {
		return {
			UTC,
			LOCAL,
			mdiInformationOutline,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			timezone: TIMEZONE,
		}),
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setTimezone: SET_TIMEZONE,
		}),
		onTimezoneChange(data) {
			this.setTimezone(data);
			this.showToastSuccess(this.$t('profile.timezone.successMessage'));
		},
	},
};
</script>
