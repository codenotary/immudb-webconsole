<template>
	<v-card
		id="Metrics"
		class="ma-0 pa-0 pr-4 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-5 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'black--text': !$vuetify.theme.dark,
					'white--text': $vuetify.theme.dark,
				}"
			>
				{{ mdiChartBoxOutline }}
			</v-icon>
			<v-tooltip
				bottom
				:nudge-top="4"
				:nudge-left="68"
				:open-delay="300"
			>
				<template #activator="{ on, attrs }">
					<div
						class="db-select-wrapper ma-0 pa-0 d-flex"
						v-bind="attrs"
						v-on="on"
					>
						<UiActionDatabaseSelect
							v-if="database"
							class="ma-0 py-0 pt-1 px-2"
							dense
							:disabled="true"
							:initial-value="database"
							v-bind="attrs"
							v-on="on"
							@update="onUpdateDatabase"
						>
							<template #prepend>
								<span
									class="prepend ma-0 pa-0 subtitle-1 font-weight-bold"
									:class="{
										'black--text ': !$vuetify.theme.dark,
										'white--text': $vuetify.theme.dark,
									}"
								>
									{{ $t('metrics.title') }}
								</span>
							</template>
						</UiActionDatabaseSelect>
					</div>
				</template>
				<span>
					{{ $t('metrics.multidatabaseComingSoon') }}
				</span>
			</v-tooltip>
			<v-spacer />
			<v-tooltip
				bottom
				:open-delay="300"
			>
				<template #activator="{ on, attrs }">
					<v-icon
						class="ma-0 mt-n1 ml-1 pa-0"
						:class="{
							[`accent--text text--darken-0`]: !$vuetify.theme.dark,
							[`accent--text text--lighten-2`]: $vuetify.theme.dark,
						}"
						color="info"
						:size="20"
						v-bind="attrs"
						v-on="on"
					>
						{{ mdiInformationOutline }}
					</v-icon>
				</template>
				<span v-html="$t('metrics.info', { value: getPeriod })" />
			</v-tooltip>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary fill-height custom-scrollbar"
		>
			<v-row class="ma-0 pa-0 d-flex flex-wrap justify-start align-start">
				<v-col
					class="ma-0 mb-4 pa-0 pr-sm-2"
					cols="12"
					sm="6"
					md="6"
				>
					<MetricsCounter
						v-if="dbUptimeHours"
						:data="dbUptimeHours"
					/>
				</v-col>
				<v-col
					class="ma-0 mb-4 pa-0 pl-sm-2"
					cols="12"
					sm="6"
					md="6"
				>
					<MetricsCounter
						v-if="dbEntries"
						:data="dbEntries"
					/>
				</v-col>
			</v-row>
			<v-row class="ma-0 pa-0 d-flex flex-wrap justify-start align-start">
				<v-col
					class="ma-0 mb-4 pa-0"
					cols="12"
				>
					<MetricsDbSize
						v-if="dbSize"
						:data="dbSize"
						:database="database"
						:period="3000"
						filled
					/>
				</v-col>
				<v-col
					class="ma-0 pa-0"
					cols="12"
					sm="12"
					md="12"
					lg="12"
				>
					<MetricsMemoryUsage
						v-if="memoryUsage"
						:data="memoryUsage"
						:database="database"
						:period="3000"
						filled
					/>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	AUTH_MODULE,
	TOKEN,
} from '@/store/auth/constants';
import {
	METRICS_MODULE,
	DB_UPTIME_HOURS,
	DB_ENTRIES,
	DB_SIZE,
	MEMORY_USAGE,
	READ_AND_WRITE,
	PERIOD,
} from '@/store/metrics/constants';
import {
	IMMUDB_MODULE,
	STATE,
} from '@/store/immudb/constants';
import {
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	mdiChartBoxOutline,
	mdiInformationOutline,
} from '@mdi/js';
import moment from 'moment';

export default {
	name: 'Metrics',
	data () {
		return {
			mdiChartBoxOutline,
			mdiInformationOutline,
			database: DEFAULT_DB,
		};
	},
	computed: {
		...mapGetters(AUTH_MODULE, {
			token: TOKEN,
		}),
		...mapGetters(METRICS_MODULE, {
			dbEntries: DB_ENTRIES,
			dbUptimeHours: DB_UPTIME_HOURS,
			dbSize: DB_SIZE,
			memoryUsage: MEMORY_USAGE,
			readAndWrite: READ_AND_WRITE,
			period: PERIOD,
		}),
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
		}),
		currentDB () {
			if (this.state) {
				const { db } = this.state;
				return db;
			}
			return '';
		},
		getPeriod () {
			return moment
					.duration(this.period, 'milliseconds')
					.humanize()
					.replace(/a /g, '');
		},
	},
	methods: {
		onUpdateDatabase (data) {
			this.database = data;
		},
	},
};
</script>

<style lang="scss">
#Metrics {
	.db-select-wrapper {
		min-width: 320px;

		.db-selector {
			.prepend,
			.append {
				min-width: 80px;
				width: auto;
			}
		}
	}
}
</style>
