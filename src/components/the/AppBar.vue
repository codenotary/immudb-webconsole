<template>
	<v-app-bar
		id="TheAppBar"
		class="bg py-0 px-0 mb-n4 justify-start align-center"
		style="z-index: 50;"
		:elevation="0"
		dense
		app
	>
		<v-container
			class="ma-0 pa-0 d-flex flex-column justify-start align-center"
			fluid
		>
			<v-row class="ma-0 pa-0 fill-width">
				<v-col
					class="ma-0 pa-0"
					cols="12"
				>
					<!-- LOGO -->
					<div
						v-if="mobile"
						class="d-flex justify-center align-center"
					>
						<v-btn
							class="d-flex justify-center align-center no-hover no-active"
							:width="48"
							:ripple="false"
							depressed
							icon
							@click="onCollapse"
						>
							<v-icon
								class="grey--text text--darken-2 headline"
								v-text="mdiMenu"
							/>
						</v-btn>
					</div>
					<v-btn
						v-else
						class="ma-0 pa-0 d-flex justify-start align-center no-hover no-active"
						href="https://www.codenotary.com"
						target="_blank"
						rel="noopener"
						:width="mini ? 56 : 214"
						:min-width="mini ? 56 : 214"
						depressed
						icon
					>
						<TheLogo
							class="no-transation"
							:class-name="`d-flex justify-${ mini ? 'center' : 'start' } align-center fill-width`"
							:size="mini ? 'normal' : 'small'"
							:icon="mini"
						/>
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
	VIEW_MODULE,
	SET_SIDEBAR,
	MOBILE,
	SIDEBAR_COLLAPSED,
	SIDEBAR_MINI,
} from '@/store/view/constants';
import { mdiMenu } from '@mdi/js';

export default {
	name: 'TheAppBar',
	data () {
		return {
			mdiMenu,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			collapsed: SIDEBAR_COLLAPSED,
			mini: SIDEBAR_MINI,
		}),
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setSidebar: SET_SIDEBAR,
		}),
		onCollapse () {
			this.setSidebar({
				collapsed: !this.collapsed,
			});
		},
	},
};
</script>

<style lang="scss">
#TheAppBar {
	transition: height 0.3s ease, color 0.3s ease;

	.v-toolbar__content {
		padding: 0 16px 0 4px;

		.row {
			display: flex !important;
			justify-content: flex-start;
			align-items: center;
		}

		.col {
			display: flex !important;
			align-items: center !important;
		}
	}
}
</style>
