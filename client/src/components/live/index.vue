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
			class="ma-0 pa-0"
		>
			<div
				class="command-line-wrapper ma-0 pa-0"
				@keydown.ctrl.72="onCtrlH"
				@keydown.ctrl.88="onCtrlX"
			>
				<vue-command
					id="LiveCommandLine"
					ref="terminal"
					class="ma-0 pa-0 bg-terminal custom-scrollbar"
					:title="title"
					:prompt="prompt"
					:commands="commands"
					:built-in="builtIn"
					:executed.sync="executed"
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
import { mapActions, mapGetters } from 'vuex';
import { createStdout, createStderr, createDummyStdout } from 'vue-command';
import {
	mdiConsoleLine,
} from '@mdi/js';
import {
	OUTPUT_MODULE,
	APPEND_CODE_OUTPUT,
	APPEND_IMMUDB,
} from '@/store/output/constants';
import {
	WEBSOCKET_MODULE,
	SOCKET_OBJ_MESSAGE,
	MESSAGE_TYPES,
} from '@/store/websocket/constants';
import {
	LIVE_MODULE,
	SET_PROMPT,
	SET_INTRO,
	PROMPT,
	// HISTORY,
	// EXECUTED,242424
	// POINTER,
	// TERM_STDIN,
	INTRO,
} from '@/store/live/constants';
import LiveIntro from '@/components/live/Intro';
import AnsiUp from 'ansi_up';

const StripAnsi = require('strip-ansi');
const DEFAULT_PROMPT = 'bash-5.1#';

export default {
	name: 'Live',
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			commands: {
				__bootstrap__: () => undefined,
				clear: () => undefined,
			},
			builtIn: undefined,
			termStdin: './immudb -d',
			pointer: 0,
			executed: new Set(),
			history: [],
			helpText: 'Type help',
			helpTimeout: 5000,
			// provide
			provided: {
				intro: {
					value: '',
				},
			},
		};
	},
	computed: {
		...mapGetters(LIVE_MODULE, {
			prompt: PROMPT,
			// history: HISTORY,
			// executed: EXECUTED,
			// pointer: POINTER,
			// termStdin: TERM_STDIN,
			intro: INTRO,
		}),
		hidePrompt () {
			return this.intro && !this.intro.finished;
		},
		showPrompt () {
			return this.prompt === DEFAULT_PROMPT;
		},
	},
	watch: {
		intro: {
			deep: true,
			immediate: true,
			handler (newVal) {
				const { value } = newVal || {};
				value && (this.provided.intro.value = value);
			},
		},
	},
	mounted () {
		// init the live terminal with a LiveIntro component
		this.$nextTick(() => this.onBootstrap());

		/// TODO THIS IS JUST A PATCH, IT SHOULD BE
		/// REMOVED REFACTORYING THE LIVE VUEX STORE
		setTimeout(() => {
			console.log(this.history.length);
			if (this.history.length < 3) {
				this.appendDummyStdout();
				this.intro.finished = true;
			};
		}, 1200);

		// increase show help timeout
		setTimeout(() => {
			this.helpTimeout = 15000;
		}, this.helpTimeout + 1);

		// manage websocket messages
		this.$options.sockets.onmessage = (event) => {
			try {
				const { data } = event;
				const chunks = data && data.split('}{');

				chunks && chunks.map((_) => {
					let _data = _;
					_data = _data.startsWith('{') ? _data : `{${ _data }`;
					_data = _data.endsWith('}') ? _data : `${ _data }}`;
					const msg = JSON.parse(_data);
					msg && this.parseMsg(msg);
				});
			}
			catch (err) {
				const { data } = event;
				console.error(err);
				console.error(data);
			}
		};
	},
	created () {
		this.commands.help = () => {
			this.onHelp();
		};

		this.commands.__bootstrap__ = ({ _ }) => {
			setTimeout(() => !_[1] && this.appendDummyStdout(), 300);
			return LiveIntro;
		};

		this.commands.clear = () => {
			this.history = [];
			this.termStdin = '';
			return createDummyStdout();
		};

		this.builtIn = (stdin) => {
			// filter out login
			if (stdin === 'login') {
				this.onLogin();
			}
			// filter out exit
			if (stdin === 'exit') {
				this.onExit();
			}
			else {
				// execute on built in
				this.onBuiltIn(stdin);
			}
		};
	},
	beforeDestroy () {
		delete this.$options.sockets.onmessage;

		const { terminal } = this.$refs;
		if (terminal) {
			terminal && terminal.scroll.resizeObserver
					.disconnect();
		}
	},
	provide () {
		return {
			intro: this.provided.intro,
		};
	},
	methods: {
		...mapActions(OUTPUT_MODULE, {
			appendCodeOutput: APPEND_CODE_OUTPUT,
			appendImmudb: APPEND_IMMUDB,
		}),
		...mapActions(LIVE_MODULE, {
			setLivePrompt: SET_PROMPT,
			setLiveIntro: SET_INTRO,
		}),
		...mapActions(WEBSOCKET_MODULE, {
			sendObj: SOCKET_OBJ_MESSAGE,
		}),
		appendDummyStdout () {
			this.history
					.push(createDummyStdout());
		},
		parseMsg (data) {
			const { type } = data;
			if (type === MESSAGE_TYPES.CONSOLE) {
				this.parseConsoleMsg(data);
			}
			else if (type === MESSAGE_TYPES.IMMUDB) {
				this.parseImmudbMsg(data);
			}
		},
		async parseConsoleMsg (data) {
			const { line } = data;

			// updated code output
			data && this.appendCodeOutput(data);

			if (line) {
				const chunks = line
						.split('\r\n')
						.filter(_ => _ !== '\r\n')
						.filter(_ => !!_);

				// parse msg
				if (line === '--MARK--\n') {
					const { value } = this.intro || { value: '' };
					this.setLiveIntro({
						finished: true,
						value: `${ value }<br>`,
					});
				}
				else if (chunks && chunks.length > 1 && !line.endsWith('\n')) {
					const idx = line.lastIndexOf('\r\n');
					await this.parseConsoleMsg({ line: `${ line.substring(0, idx) }\n` });
					await this.parseConsoleMsg({ line: line.substring(idx, line.length) });
				}
				else if (!line.endsWith('\n')) {
					this.setLivePrompt({
						prompt: line.trim(),
					});
					this.appendDummyStdout();
				}
				else if (/^\s*$/.test(line)) {
					// console.error('SKIP: just new line');
				}
				else {
					// reset default prompt
					this.setLivePrompt({
						prompt: DEFAULT_PROMPT,
					});

					// append live terminal output
					if (this.intro.finished) {
						this.appendOutput(line);
					}
					else {
						this.appendIntro(line);
					}

					// scroll to latest row
					this.scrollToBottom();
				}
			}
		},
		parseImmudbMsg (data) {
			const { immudb, tree, token, verified } = data;

			// update merkle tree output
			this.appendImmudb({
				immudb,
				tree,
				token,
				verified,
			});
		},
		parseLine (line, ansi = true) {
			if (ansi) {
				const ansiUp = new AnsiUp();
				ansiUp.use_classes = true;
				return ansiUp.ansi_to_html(line.trim()) + '<br>';
			}
			else {
				return StripAnsi(line.trim()) + '<br>';
			}
		},
		appendIntro (line, stderr = false) {
			try {
				const { value } = this.intro || { value: '' };
				this.setLiveIntro({
					value: `${ value }${ this.parseLine(line) }`,
				});
			}
			catch (err) {
				console.error(err);
			}
		},
		appendOutput (line) {
			try {
				const { terminal } = this.$refs;
				terminal.setIsInProgress(true);
				this.history
						.push(
							this.flux === 'stderr'
								? createStderr(this.parseLine(line), false, false)
								: createStdout(this.parseLine(line), false, false, false),
						);
				terminal.setPointer(this.pointer + 1);
				terminal.setIsInProgress(false);
			}
			catch (err) {
				console.error(err);
			}
		},
		onBuiltIn (stdin) {
			try {
				const { terminal } = this.$refs;

				terminal && terminal.setIsInProgress(true);

				this.$nextTick(() => {
					terminal && terminal.setPointer(this.pointer + 1);
					terminal && terminal.executed.add(stdin);
				});

				// send message to WS
				this.sendObj({
					cmd: undefined,
					line: `${ stdin }\n`,
				});

				this.$nextTick(() => {
					terminal && terminal.setIsInProgress(false);
				});
			}
			catch (err) {
				console.error(err);
			}
		},
		onCtrl (data) {
			if (data) {
				const { keyCode, altKey, shiftKey } = data;
				let command = 'ctrl';
				altKey && (command += '+alt');
				shiftKey && (command += '+shift');
				keyCode && (command += `+${ keyCode }`);
				if (keyCode !== 17) {
					this.$nextTick(() => {
						this.sendObj({
							cmd: undefined,
							line: `${ command }\n`,
						});
					});
				}
			}
		},
		onCtrlH () {
			this.onHelp();
		},
		onCtrlX () {
			this.onExit();
		},
		onHelp () {
			this.sendObj({
				cmd: undefined,
				line: 'immuclient help\n',
			});
		},
		onBootstrap () {
			const { terminal } = this.$refs;
			terminal && terminal.execute(`__bootstrap__${ this.intro.finished ? '' : ' DO_NOT_APPEND' }`);
			this.$nextTick(() => this.scrollToBottom());
		},
		onLogin () {
			if (this.prompt !== DEFAULT_PROMPT) {
				// send login message to WS
				this.sendObj({
					cmd: undefined,
					line: 'login\n',
				});
			}
			else {
				this.appendOutput('command not allowed at this level', true);
			}
		},
		onExit () {
			if (this.prompt !== DEFAULT_PROMPT) {
				// send exit message to WS
				this.sendObj({
					cmd: undefined,
					line: 'exit\n',
				});
				this.setLivePrompt({
					prompt: DEFAULT_PROMPT,
				});
			}
			else {
				this.appendOutput('command not allowed at this level', true);
			}
		},
		scrollToBottom () {
			// scroll to latest row
			const { terminal: { $el: el } } = this.$refs;
			if (el) {
				this.$nextTick(() => {
					el.scrollTop = el.scrollHeight;
				});
			}
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
						.term-bar,
						.term-std {
							background-color: transparent !important;
						}

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
										&,
										input {
											font-family: Inconsolata, monospace !important;
											font-size: 0.875rem !important;
										}
									}

									.term-stdout,
									.term-stderr {
										position: relative;
										word-wrap: break-word;
										white-space: pre-wrap;
										tab-size: $spacer-16;
									}

									&.stdout-only {
										:not(.live-intro) {
											&.term-stdout,
											&.term-stderr {
												display: inline-block;
												margin: $spacer-2 auto;
												padding-left: $spacer-4;

												&::before {
													content: '';
													position: absolute;
													top: 0;
													bottom: 0;
													left: 0;
													width: 2px;
												}
											}

											&.term-stdout {
												&::before {
													background-color: $primary;
												}
											}

											&.term-stderr {
												&::before {
													background-color: $primary;
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
	}
}
</style>
