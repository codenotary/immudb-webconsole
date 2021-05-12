<template>
	<v-tooltip
		bottom
		:open-delay="300"
	>
		<template v-slot:activator="{ on, attrs }">
			<div
				v-bind="attrs"
				v-on="on"
			>
				<v-switch
					class="ma-0 pa-0"
					:value="!!value"
					dense
					hide-details
					@change="onUpdate"
				/>
			</div>
		</template>
		<span>
			{{ $t(`users.action.hideDisabled.tooltip.${ value ? 'show' : 'hide' }`) }}
		</span>
	</v-tooltip>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_HIDE_DISABLED,
	IS_LOADING,
	HIDE_DISABLED,
} from '@/store/view/constants';

export default {
	name: 'UsersActionHideDisabled',
	data () {
		return {
			value: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
			hideDisabled: HIDE_DISABLED,
		}),
	},
	watch: {
		hideDisabled: {
			deep: true,
			immediate: true,
			handler (newVal) {
				this.$nextTick(() => {
					this.value = newVal;
				});
			},
		},
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setHideDisabled: SET_HIDE_DISABLED,
		}),
		onUpdate (data) {
			this.setHideDisabled(!!data);
		},
	},
};
</script>
