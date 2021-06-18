<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-top-center"
		bottom
		:open-delay="300"
		:nudge-bottom="6"
	>
		<template #activator="{ on, attrs }">
			<div
				class="d-flex justify-start align-center"
				v-bind="attrs"
				v-on="on"
			>
				<span
					class="ma-0 mr-2 pa-0 body-2"
					:class="{
						'gray--text text--lighten-1': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
					}"
				>
					{{ $t('users.action.hideNotActive.label') }}
				</span>
				<v-switch
					class="ma-0 ml-2 pa-0"
					:value="!!value"
					dense
					hide-details
					@change="onUpdate"
				/>
			</div>
		</template>
		<span class="body-2">
			{{ $t(`users.action.hideNotActive.tooltip.${ value
				? 'show'
				: 'hide'
			}`) }}
		</span>
	</v-tooltip>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_HIDE_NOT_ACTIVE,
	IS_LOADING,
	HIDE_NOT_ACTIVE,
} from '@/store/view/constants';

export default {
	name: 'UsersActionHideNotActive',
	data () {
		return {
			value: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
			hideNotActive: HIDE_NOT_ACTIVE,
		}),
	},
	watch: {
		hideNotActive: {
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
			setHideNotActive: SET_HIDE_NOT_ACTIVE,
		}),
		onUpdate (data) {
			this.setHideNotActive(!!data);
		},
	},
};
</script>
