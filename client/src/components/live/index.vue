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
					:built-in="builtIn"
					:is-in-progress="isInProgress"
					:history.sync="history"
					:stdin.sync="termStdin"
					:pointer.sync="pointer"
					:hide-prompt="hidePrompt"
					:help-text="helpText"
					:help-timeout="helpTimeout"
					show-help
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
	props: {
		outputPrefix: { type: String, default: '>>' },
	},
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			prompt: 'demo@user: #',
			intro: {
				value: '',
			},
			introFinished: true,
			commands: {
				intro: () => undefined,
				clear: () => undefined,
			},
			builtIn: undefined,
			isInProgress: false,
			termStdin: '',
			pointer: 0,
			executed: new Set(),
			history: [],
			helpText: 'Type help',
			helpTimeout: 5000,
		};
	},
	computed: {
		hidePrompt () {
			return !this.introFinished;
		},
	},
	mounted () {
		// init the live terminal with a LiveIntro component
		this.$nextTick(() => {
			this.history = [LiveIntro];
		});
		this.introFinished = false;

		// manage websocket messages
		this.$options.sockets.onmessage = (data) => {
			const msg = JSON.parse(event.data);

			if (msg) {
				const { line, flux, tree, token } = msg;
				if (!line.startsWith('bash-5.1#')) {
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

					// scroll to latest row
					const { terminal: { $el: el } } = this.$refs;
					if (el) {
						el.scrollTop = el.scrollHeight - (this.introFinished ? 0 : 64);
					}
				}
			}
		};
	},
	created () {
		this.commands.help = () => {
			this.$socket && this.$socket.sendObj({
				cmd: undefined,
				line: 'immuclient help\n',
			});
		};

		this.commands.intro = () => {
			// this.termStdin = '';
			setTimeout(() => {
				this.history
						.push(createDummyStdout());
			}, 300);
			return LiveIntro;
		};

		this.commands.clear = () => {
			this.history = [];
			this.termStdin = '';
			return createDummyStdout();
		};

		this.builtIn = (stdin) => {
			if (Object.keys(this.commands).includes(stdin)) {
				return;
			}

			this.isInProgress = true;

			// send message to WS
			this.$socket && this.$socket.sendObj({
				cmd: undefined,
				line: `${ stdin }\n`,
			});

			this.executed.delete(stdin);
			this.executed.add(stdin);
			this.pointer += 1;
			// this.history
			// 		.push(createStdout('>> hello world'));
			// this.history
			// 		.push(createStdout(stdin));
			this.history
					.push(createDummyStdout());
			this.termStdin = '';

			this.isInProgress = false;
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
			const newLine = `<span class="${ stderr ? 'stderr' : 'stdout' }">${ line }</span>`;
			this.intro.value = `${ this.intro.value }${ this.intro.value && '<br>' }${ newLine }`;
		},
		appendOutput (line, stderr = false, intro = false) {
			this.$refs.terminal.setIsInProgress(true);
			const _line = `${ this.outputPrefix } ${ line }`;
			this.history
					.push(
						intro
							? createStdout(_line)
							: stderr
								? createStderr(_line)
								: createStdout(_line),
					);
			this.$refs.terminal.setIsInProgress(false);
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

					.vue-command {
						.term-std {
							min-height: 100%;
							height: unset;

							.term-cont {
								margin: 0 !important;
								padding: $spacer-4 $spacer-4 $spacer-12;

								.term-hist {
									.term-ps,
									.term-stdin {
										margin-top: $spacer-4;
										margin-bottom: $spacer-4;
									}

									.term-stdout,
									.term-stderr {
										word-wrap: break-word;
										white-space: pre-wrap;
									}

									.term-stdin {
										input {
											opacity: 1;
											animation-name: fadeInOpacity;
											animation-iteration-count: 1;
											animation-timing-function: ease-in;
											animation-delay: 4.9s;
											animation-duration: 0.6s;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
