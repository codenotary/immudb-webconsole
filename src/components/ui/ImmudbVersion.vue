<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-center"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<span
				class="ma-0 pa-0 h-24 caption d-flex justify-start align-center"
				:class="{
					'gray--text text--lighten-1': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
				v-bind="attrs"
				v-on="on"
			>
				<p
					v-if="immudb && immudb.version"
					class="my-1 ml-0 mr-2 pa-0"
				>
					{{ $t('footer.version.tooltip.immudb.short', { version: immudb.version }) }}
				</p>
				<p
					v-if="webconsole && webconsole.version"
					class="my-1 mx-0 pa-0"
				>
					{{ $t('footer.version.tooltip.webconsole.short', { version: webconsole.version }) }}
				</p>
			</span>
		</template>
		<span class="body-2">
			<p
				v-if="immudb && immudb.version"
				class="my-1 mx-0 pa-0"
			>
				{{ $t(`footer.version.tooltip.immudb.${ immudb.hash ? 'withHash' : 'normal' }`, { version: immudb.version, hash: immudb.hash }) }}
			</p>
			<p
				v-if="webconsole && webconsole.version"
				class="my-1 mx-0 pa-0"
			>
				{{ $t(`footer.version.tooltip.webconsole.${ webconsole.hash ? 'withHash' : 'normal' }`, { version: webconsole.version, hash: webconsole.hash }) }}
			</p>
		</span>
	</v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	IMMUDB_MODULE,
	HEALTH,
} from '@/store/immudb';
import { EmbeddedService } from '@/services/embedded';
import { version } from './../../../package';

export default {
	name: 'UiImmudbVersion',
	data () {
		return {
			immudb: {
				version: (this.health && this.health.version) || '1.0.5',
				hash: '',
			},
			webconsole: {
				version,
				hash: process.env.VUE_APP_GIT_COMMIT_HASH,
			},

		};
	},
	computed: {
		...mapGetters(IMMUDB_MODULE, {
			health: HEALTH,
		}),
	},
	watch: {
		health: {
			deep: true,
			immediate: true,
			handler (newVal) {
				try {
					if (newVal) {
						const { version } = newVal;
						if (version) {
							this.immudb.version = version.split('-')[0];
							this.immudb.hash = version.split('-')[1].slice(0, 7);
						}
					}
				}
				catch (err) {
					console.error(err);
				}
			},
		},
	},
	mounted () {
		try {
			const { data } = EmbeddedService.version();
			if (data) {
				if (!this.webconsole.hash) {
					this.webconsole.hash = data[0].version;
				}
				if (!this.immudb.hash) {
					this.immudb.hash = data[1].version;
				}
			}
		}
		catch (err) {
			console.error(err);
		}
	},
};
</script>
