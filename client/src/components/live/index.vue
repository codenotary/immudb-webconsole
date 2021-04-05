<template>
	<v-card
		id="Live"
		class="ma-0 pa-0 bg fill-height shadow"
		elevation="0"
	>
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
					:history.sync="history"
					:stdin.sync="termStdin"
					:is-in-progress="!showPrompt"
					:hide-prompt="showPrompt"
					@executed="onExecute($event)"
					@keydown.enter.native.stop.prevent="onExecute"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { createStdout, createStderr, createDummyStdout } from 'vue-command';
import {
	mdiConsoleLine,
} from '@mdi/js';
import {
	OUTPUT_MODULE,
	APPEND_CODE_OUTPUT,
	SET_IMMUDB,
} from '@/store/output/constants';
import LiveIntro from '@/components/live/Intro';

export default {
	name: 'Live',
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			prompt: 'demo@user: #',
			intro: {
				value: '',
			},
			introFinished: false,
			commands: {
				intro: () => undefined,
				clear: () => undefined,
			},
			termStdin: '',
			history: [],
		};
	},
	computed: {
		showPrompt () {
			return !this.introFinished;
		},
	},
	mounted () {
		// init the live terminal with a LiveIntro component
		this.$nextTick(() => {
			this.history = [LiveIntro];
		});

		// manage websocket messages
		this.$options.sockets.onmessage = (data) => {
			const msg = JSON.parse(event.data);
			if (msg) {
				const { line, flux, tree, token } = msg;

				// append code output
				this.appendCodeOutput(msg);
				tree && this.setImmudb({ immudb: tree });
				token && this.setImmudb({ token });

				// append live terminal output
				if (this.introFinished) {
					this.appendOutput(line, flux === 'stderr', true);
				}
				else if (line === '--MARK--\n') {
					this.introFinished = true;
				}
				else {
					this.appendIntro(line, flux === 'stderr');
				}
			}
		};
	},
	created () {
		this.commands.intro = () => {
			return LiveIntro;
		};

		this.commands.clear = () => {
			this.history = [];
			this.termStdin = '';
			return createDummyStdout();
		};
	},
	beforeDestroy () {
		delete this.$options.sockets.onmessage;

		if (this.$refs.vueCommand) {
			this.$refs.vueCommand.scroll.resizeObserver.disconnect();
		}
	},
	provide () {
		return {
			intro: this.intro,
		};
	},
	methods: {
		...mapActions(OUTPUT_MODULE, {
			appendCodeOutput: APPEND_CODE_OUTPUT,
			setImmudb: SET_IMMUDB,
		}),
		appendIntro (line, stderr = false) {
			console.log('appendIntro', line);

			const newLine = `<span class="${ stderr ? 'stderr' : 'stdout' }">${ line }</span>`;
			this.intro.value = `${ this.intro.value }${ this.intro.value && '<br>' }${ newLine }`;
		},
		appendOutput (line, stderr = false, intro = false) {
			console.log('appendOutput', line);

			this.$refs.terminal.setIsInProgress(true);
			this.history
					.push(
						intro
							? createStdout(line)
							: stderr
								? createStderr(line)
								: createStdout(line),
					);
			this.$refs.terminal.setIsInProgress(false);
		},
		onExecute (data) {
			this.$socket && this.$socket.sendObj(data);
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

					.term-cont {
						.term-hist {
							margin: $spacer-4 0;

							.term-stdout,
							.term-stderr {
								word-wrap: break-word;
								white-space: normal;
							}
						}
					}
				}
			}
		}
	}
}
</style>
