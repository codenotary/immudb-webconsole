<template>
	<v-card
		id="Live"
		class="ma-0 pa-0 bg fill-height pane shadow"
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
			<div
				class="command-line-wrapper ma-0 pa-0"
				@keydown.ctrl.88="onExit"
			>
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
					:show-help="showPrompt"
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

const WS_PROMPT = 'bash-5.1#';
const DEFAULT_PROMPT = 'demo@user: #';

export default {
	name: 'Live',
	props: {
		outputPrefix: { type: String, default: '>>' },
	},
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			prompt: DEFAULT_PROMPT,
			intro: {
				value: '',
			},
			introFinished: true,
			ignoredFirstPrompt: false,
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
		showPrompt () {
			return this.promp === DEFAULT_PROMPT;
		},
	},
	mounted () {
		// init the live terminal with a LiveIntro component
		this.$nextTick(() => {
			this.history = [LiveIntro];
		});

		// increase show help timeout
		setTimeout(() => {
			this.helpTimeout = 15000;
		}, this.helpTimeout + 1);

		this.introFinished = false;

		// manage websocket messages
		this.$options.sockets.onmessage = (data) => {
			const msg = JSON.parse(event.data);

			if (msg) {
				const { line, flux, tree, token } = msg;

				// update merkle tree output
				tree && this.setImmudb({ immudb: tree });
				token && this.setImmudb({ token });

				// updated code output
				msg && this.appendCodeOutput(msg);

				if (line) {
					// parse msg
					if (line === '--MARK--\n') {
						this.introFinished = true;
					}
					else if (!line.endsWith('\n')) {
						// use prompt from WS
						this.prompt = line.startsWith(WS_PROMPT)
							? DEFAULT_PROMPT
							: line;

						if (this.ignoredFirstPrompt) {
							console.log('=====', line);
							this.history
									.push(createDummyStdout());
						}
						else {
							this.ignoredFirstPrompt = true;
						}
					}
					else {
						// reset default prompt
						this.prompt = DEFAULT_PROMPT;

						// append live terminal output
						if (this.introFinished) {
							this.appendOutput(line, flux === 'stderr', true);
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
			return LiveIntro;
		};

		this.commands.clear = () => {
			this.history = [];
			this.termStdin = '';
			return createDummyStdout();
		};

		this.commands.exit = () => {
			if (this.prompt !== DEFAULT_PROMPT) {
				// send exit message to WS
				this.$socket && this.$socket.sendObj({
					cmd: undefined,
					line: 'exit\n',
				});
				this.prompt = DEFAULT_PROMPT;
			}
			return createDummyStdout();
		};

		this.builtIn = (stdin) => {
			if (Object.keys(this.commands).includes(stdin)) {
				return;
			}

			const { terminal } = this.$refs;

			terminal.setIsInProgress(true);
			this.executed.add(createStdout(stdin));

			// send message to WS
			this.$socket && this.$socket.sendObj({
				cmd: undefined,
				line: `${ stdin }\n`,
			});

			terminal.setIsInProgress(this.pointer + 1);

			// this.history
			// 		.push(createStdout(`>> ${ stdin }`));

			terminal.setIsInProgress(false);
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
		onExit () {
			// send exit message to WS
			this.$socket && this.$socket.sendObj({
				cmd: undefined,
				line: 'exit\n',
			});
			this.history
					.push(createDummyStdout());
		},
	},
};
</script>

<style lang="scss">
#Live {
	&.v-card {
		top: 2px;

		.v-card__text {
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
									.term-stdin,
									.term-stdout,
									.term-stderr {
										font-family: Inconsolata, monospace;
										font-size: 0.875rem !important;
									}

									.term-stdout,
									.term-stderr {
										word-wrap: break-word;
										white-space: pre-wrap;
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
