<template>
	<v-card
		id="Live"
		class="ma-0 pa-0 bg fill-height shadow"
		elevation="0"
	>
		{{ message }}
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiConsoleLine }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('live.title') }}
			</h4>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-terminal"
		>
			<div class="command-line-wrapper ma-0 pa-0">
				<vue-command
					id="LiveCommandLine"
					ref="terminal"
					class="ma-0 pa-0 custom-scrollbar"
					:title="title"
					:prompt="prompt"
					:commands="commands"
					:history="termHistory"
					:stdin.sync="termStdin"
					:cursor.sync="termCursor"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { createStdout, createStderr } from 'vue-command';
import {
	WEBSOCKET_MODULE,
	SOCKET_MESSAGE,
} from '@/store/websocket/constants';
import {
	mdiConsoleLine,
} from '@mdi/js';

export default {
	name: 'Live',
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			prompt: 'demo@user: #',
			commands: {},
			termStdin: '',
			termHistory: [],
			termCursor: 0,
		};
	},
	computed: {
		...mapGetters(WEBSOCKET_MODULE, {
			message: SOCKET_MESSAGE,
		}),
	},
	watch: {
		termStdin: {
			handler (newVal) {
				this.commands = {};
				this.commands[this.termStdin] = this.executeCmd;
			},
		},
		message: {
			deep: true,
			handler (newVal) {
				console.log(newVal);
			},
		},
	},
	mounted () {
		this.$options.sockets.onmessage = (data) => {
			const msg = JSON.parse(event.data);
			console.log(msg);
		};
	},
	beforeDestroy () {
		delete this.$options.sockets.onmessage;
	},
	methods: {
		executeCmd (cmd) {
			const data = {
				line: this.termStdin,
				cmd: undefined,
			};

			return new Promise((resolve, reject) => {
				try {
					this.$socket.sendObj(data);
					resolve(createStdout());
				}
				catch (err) {
					console.error(err);
					resolve(createStderr(err));
				}
			});
		},
	},
};
</script>

<style lang="scss">
#Live {
	&.v-card {
		.v-card__title {
			height: 44px !important;

			@media (max-width: 480px) {
				height: 32px !important;
			}
		}

		.v-card__text {
			height: calc(100% - 44px) !important;

			.command-line-wrapper {
				&,
				.vue-command {
					height: 100%;
				}

				.vue-command {
					.term-std {
						min-height: 100%;
						height: unset;
					}
				}
			}
		}
	}
}
</style>
