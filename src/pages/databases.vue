<template>
	<v-card
		id="Databases"
		class="ma-0 pa-0 pr-4 pb-3 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'gray--text text--lighten-2': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
				:size="24"
			>
				{{ mdiDatabaseCogOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--lighten-1': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
			>
				{{ $t('databases.title') }}
			</h4>
			<v-spacer />
			<LazyDatabasesActionFilter
				:filter.sync="filter"
			/>
			<v-divider
				v-if="showAdd"
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<LazyDatabasesActionAdd
				v-if="showAdd"
				@submit="showAddDatabase = true"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary fill-height custom-scrollbar"
		>
			<div class="ma-0 pa-0">
				<LazyDatabasesDatatable
					class="ma-0 pa-0"
					:filter="filter"
					:active-database="activeDatabase"
					:items="databaseList"
					@update:use="onUseDatabase"
				/>
			</div>
		</v-card-text>

		<!-- MODALS -->
		<LazyDatabasesModalAdd
			v-model="showAddDatabase"
			color="success"
			@submit="onAddDatabase"
		/>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SPLASH,
} from '@/store/view/constants';
import {
	AUTH_MODULE,
	AUTHENTICATED,
	USER_PERMISSION,
} from '@/store/auth/constants';
import {
	DATABASE_MODULE,
	FETCH_DATABASE_LIST,
	SET_ACTIVE_DATABASE,
	SET_DATABASE_LIST,
	ADD_DATABASE,
	USE_DATABASE,
	DATABASE_LIST,
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	IMMUDB_MODULE,
	FETCH_STATE,
	STATE,
} from '@/store/immudb/constants';
import {
	mdiDatabaseCogOutline,
} from '@mdi/js';

export default {
	name: 'Databases',
	async fetch () {
		await this.fetchDatabaseList();
	},
	data () {
		return {
			mdiDatabaseCogOutline,
			filter: '',
			showAddDatabase: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			splash: SPLASH,
		}),
		...mapGetters(AUTH_MODULE, {
			authenticated: AUTHENTICATED,
			userPermission: USER_PERMISSION,
		}),
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
		}),
		...mapGetters(DATABASE_MODULE, {
			databaseList: DATABASE_LIST,
		}),
		showAdd () {
			try {
				const { permission } = this.userPermission(DEFAULT_DB) ||
					{ permission: 0 };
				return permission === 255;
			}
			catch (err) {
				console.error(err);
				return false;
			}
		},
		activeDatabase () {
			if (this.state) {
				const { db } = this.state;
				return db;
			}
			return '';
		},
	},
	watch: {
		authenticated: {
			deep: true,
			handler (newVal) {
				if (newVal) {
					this.fetchDatabaseList();
				}
				else {
					this.setDatabaseList({ databases: [] });
				}
			},
		},
	},
	methods: {
		...mapActions(IMMUDB_MODULE, {
			fetchState: FETCH_STATE,
		}),
		...mapActions(DATABASE_MODULE, {
			fetchDatabaseList: FETCH_DATABASE_LIST,
			setActiveDatabase: SET_ACTIVE_DATABASE,
			setDatabaseList: SET_DATABASE_LIST,
			addDatabase: ADD_DATABASE,
			useDatabase: USE_DATABASE,
		}),
		async onAddDatabase (data) {
			try {
				await this.addDatabase(data);
				await this.fetchDatabaseList();
				if (!this.splash) {
					this.$toasted.success(this.$t('databases.action.add.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				console.error(err);
				this.showToastError(err);
			}
		},
		async onUseDatabase (data) {
			try {
				await this.setActiveDatabase({ active: data });
				await this.useDatabase(data);
				await this.fetchDatabaseList();
				if (!this.splash) {
					this.$toasted.success(this.$t('databases.table.action.use.success'), {
						duration: 3000,
						icon: 'check-circle',
					});
				}
			}
			catch (err) {
				console.error(err);
				this.showToastError(err);
			}
		},
	},
};
</script>

<style lang="scss">
#Databases {
	&.pane {
		&::after {
			content: '';
			position: absolute;
			top: calc(#{$header-height} + 1px);
			right: calc(#{$spacer-4} + 1px);
			bottom: 0;
			left: 1px;
			pointer-events: none !important;
		}

		&.theme-- {
			&light {
				&::after {
					outline: 1px solid rgba(0, 0, 0, 0.05);
				}
			}
		}
	}
}
</style>
