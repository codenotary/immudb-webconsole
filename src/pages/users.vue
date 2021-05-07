<template>
	<v-card
		id="Users"
		class="ma-0 pa-0 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-6 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiAccountMultipleOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('users.title') }}
			</h4>
			<v-spacer />
			<UsersActionFilter
				:filter.sync="filter"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<UsersActionAdd
				@submit="onAddUser"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary custom-scrollbar"
		>
			<div class="ma-0 pa-0 fill-height">
				<UsersDatatable
					class="ma-0 pa-0 fill-height"
					:filter="filter"
					:items="userList"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	USER_MODULE,
	FETCH_USER_LIST,
	USER_LIST,
} from '@/store/user/constants';

import {
	mdiAccountMultipleOutline,
} from '@mdi/js';

export default {
	name: 'Users',
	async fetch () {
		await this.fetchUserList();
	},
	data () {
		return {
			mdiAccountMultipleOutline,
			filter: '',
		};
	},
	computed: {
		...mapGetters(USER_MODULE, {
			userList: USER_LIST,
		}),
	},
	methods: {
		...mapActions(USER_MODULE, {
			fetchUserList: FETCH_USER_LIST,
		}),
		onAddUser () {
			console.log('add user');
		},
	},
};
</script>
