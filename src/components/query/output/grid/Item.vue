<template>
	<div
		id="OutputGridItem"
		class="my-2 mx-0 pa-0 fill-height"
	>
		<div v-if="divider">
			<v-divider
				class="my-2 mx-0"
				style="opacity: 0.55;"
			/>
		</div>
		<div
			v-else
			:class="`bar-${ flux }`"
		>
			<div class="ma-0 pa-0 d-flex flex-row justify-space-between align-center fill-width">
				<span>
					<span
						v-if="timestamp"
						class="ma-0 pa-0 caption grey--text text--lighten-1"
					>
						{{ timestamp }}
					</span>
					<span
						v-if="timestamp"
						class="my-0 mx-2 pa-0"
					>
						{{ separator }}
					</span>
					<span :class="`ma-0 mr-2 pa-0 caption stdx ${ flux }`">
						{{ flux }}
					</span>
				</span>
				<span class="ma-0 pa-0 caption">
					TxID: <span class="font-weight-bold">{{ item.tx }}</span>
					<v-chip
						class="ma-0 ml-1 mb-1 py-0 px-2 caption"
						color="accent"
						small
						dense
					>
						<span
							v-if="item.timeTravel"
							class="ma-0 pa-0 pr-1 d-flex justify-center align-center"
						>
							<v-icon
								class="gray--text text--lighten-3"
								dense
								:size="20"
							>
								{{ mdiHistory }}
							</v-icon>
							<span class="ma-0 ml-2 pa-0 caption">
								{{ $t('query.output.grid.timeTravel') }}
							</span>
						</span>
						<span
							v-else
							class="ma-0 pa-0 pr-1 d-flex justify-center align-center"
						>
							<v-icon
								class="gray--text text--lighten-3"
								:class="{
									'gray--text text--lighten-3': !$vuetify.theme.dark,
									'gray--text text--lighten-3': $vuetify.theme.dark,
								}"
								dense
								:size="20"
							>
								{{ mdiHistory }}
							</v-icon>
							<span class="ma-0 ml-2 pa-0 caption">
								{{ $t('query.output.grid.present') }}
							</span>
						</span>
					</v-chip>
				</span>
			</div>
			<p>
				<QueryOutputGridTable
					v-if="showTable"
					:item="item"
				/>
				<span
					v-else
					class="ma-0 pa-0 caption grey--text text--lighten-1"
				>
					message: {{ line }}
				</span>
			</p>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	IMMUDB_MODULE,
	TX,
} from '@/store/immudb/constants';
import timeUtils from '@/mixins/timeUtils';
import {
	mdiHistory,
} from '@mdi/js';

export default {
	name: 'QueryOutputGridItem',
	mixins: [timeUtils],
	props: {
		item: { type: Object, default: () => {} },
		separator: { type: String, default: '-' },
	},
	data () {
		return {
			mdiHistory,
		};
	},
	computed: {
		...mapGetters(IMMUDB_MODULE, {
			tx: TX,
		}),
		flux () {
			if (this.item) {
				const { flux } = this.item;
				return flux;
			}
			return '';
		},
		line () {
			if (this.item) {
				const { line } = this.item;
				return line;
			}
			return '';
		},
		timestamp () {
			if (this.item) {
				const { timestamp } = this.item;
				if (timestamp) {
					return this.timestampToString(timestamp * 1000);
				}
				else {
					return this.now();
				}
			}
			return '';
		},
		divider () {
			if (this.item) {
				const { divider } = this.item;
				return divider;
			}
			return false;
		},
		showTable () {
			if (this.item) {
				const { flux } = this.item;
				return flux === 'stdtable';
			}
			return false;
		},
	},
};
</script>

<style lang="scss">
#OutputGridItem {
	position: relative;
	overflow: hidden;

	&.bar- {
		&stdout,
		&stderr,
		&execerr {
			&::before {
				content: '';
				position: absolute;
				top: 5%;
				left: 0;
				height: 90%;
				width: 2px;
			}
		}

		&stdout {
			&::before {
				background-color: $success;
			}
		}

		&stderr {
			&::before {
				background-color: $error;
			}
		}

		&execerr {
			&::before {
				background-color: $accent;
			}
		}
	}

	.stdx {
		&.stdout {
			color: $success;
		}

		&.stderr {
			color: $error;
		}

		&.execerr {
			color: $accent;
		}
	}
}
</style>
