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
			<v-spacer />
			<UiActionReset
				@reset="onReset"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<LiveActionClear
				@submit="onClear"
			/>
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
					:is-in-progress="isInProgress"
					:prompt="prompt"
					:commands="commands"
					:built-in="builtIn"
					:stdin.sync="_termStdin"
					:pointer.sync="_pointer"
					:executed="_executed"
					:history="_history"
					:hide-promt="hidePrompt"
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
import { createDummyStdout } from 'vue-command';
import {
	mdiConsoleLine,
} from '@mdi/js';
import {
	OUTPUT_MODULE,
	RESET_IMMUDB,
	RESET_MERKLE_TREE,
	RESET_OUTPUT,
	APPEND_CODE_OUTPUT,
	APPEND_IMMUDB,
} from '@/store/output/constants';
import {
	WEBSOCKET_MODULE,
	SOCKET_OBJ_MESSAGE,
} from '@/store/websocket/constants';
import {
	LIVE_MODULE,
	SET_IN_PROGRESS,
	SET_PROMPT,
	SET_TERM_STDIN,
	SET_POINTER,
	CLEAR_OUTPUT,
	APPEND_DUMMY_OUTPUT,
	APPEND_OUTPUT,
	APPEND_EXECUTED,
	SET_HISTORY,
	SET_EXECUTED,
	SET_COMMAND,
	IS_IN_PROGRESS,
	PROMPT,
	HISTORY,
	EXECUTED,
	POINTER,
	TERM_STDIN,
	INTRO,
	COMMAND,
	DEFAULT_PROMPT,
	IMMUCLIENT_PROMPT,
} from '@/store/live/constants';
import LiveIntro from '@/components/live/Intro';

export default {
	name: 'Live',
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			commands: {
				__bootstrap__: () => undefined,
				clear: () => undefined,
				help: () => undefined,
			},
			local: {
				termStdin: '',
				pointer: 0,
				history: [],
				executed: new Set(),
			},
			builtIn: undefined,
			helpText: 'Type help',
			helpTimeout: 5000,
		};
	},
	computed: {
		...mapGetters(LIVE_MODULE, {
			isInProgress: IS_IN_PROGRESS,
			prompt: PROMPT,
			history: HISTORY,
			executed: EXECUTED,
			pointer: POINTER,
			termStdin: TERM_STDIN,
			intro: INTRO,
			commandToExecute: COMMAND,
		}),
		hidePrompt () {
			return this.intro && !this.intro.finished;
		},
		showPrompt () {
			return this.prompt && this.prompt.trim() === DEFAULT_PROMPT;
		},
		isDefaultClient () {
			return this.prompt && this.prompt.trim() === DEFAULT_PROMPT;
		},
		isImmuClient () {
			return this.prompt && this.prompt.trim() === IMMUCLIENT_PROMPT;
		},
		_termStdin: {
			get () {
				return this.local.termStdin;
			},
			set (newVal) {
				this.setTermStdin(newVal);
			},
		},
		_pointer: {
			get () {
				return this.local.pointer;
			},
			set (newVal) {
				this.setPointer(newVal);
			},
		},
		_history: {
			get () {
				return this.local.history;
			},
			set (newVal) {
				this.setHistory(newVal);
			},
		},
		_executed: {
			get () {
				return this.local.executed; // new Set(this.executed);
			},
			set (newVal) {
				this.setExecuted(newVal);
			},
		},
	},
	watch: {
		commandToExecute: {
			handler (newVal) {
				if (newVal) {
					this.$nextTick(() => {
						const { terminal } = this.$refs;
						if (terminal && terminal.$children &&
							terminal.$children[terminal.$children.length - 1]) {
							const stdin = terminal.$children[terminal.$children.length - 1];
							stdin.local.stdin = newVal.trim();
							stdin.handle();
						}
					});
					this.setCommand('');
				}
			},
		},
		termStdin: {
			handler (newVal) {
				// this.local.termStdin = newVal;
				this.local.termStdin = JSON.parse(JSON.stringify(newVal));
			},
		},
		pointer: {
			handler (newVal) {
				// this.local.pointer = newVal;
				this.local.pointer = JSON.parse(JSON.stringify(newVal || 0));
			},
		},
		history: {
			deep: true,
			handler (newVal) {
				this.local.history = newVal;
				// this.local.history = JSON.parse(JSON.stringify(newVal));
			},
		},
		executed: {
			deep: true,
			handler (newVal) {
				this.local.execute = new Set(newVal);

				// add last command to executed
				this.$nextTick(() => {
					const { terminal } = this.$refs;
					const lastVal = newVal && newVal[newVal.length - 1];
					if (terminal && terminal.local) {
						terminal.local.executed.add(lastVal);
					}
				});
			},
		},
	},
	mounted () {
		// init the live terminal with a LiveIntro component
		this.$nextTick(() => {
			this.onBootstrap();
			this.scrollToBottom();
		});

		// increase show help timeout
		setTimeout(() => {
			this.helpTimeout = 15000;
		}, this.helpTimeout + 1);

		this._keyListener = function(e) {
			if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				if (!this.isLoading) {
					this.onReset();
				}
			}
			if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				if (!this.isLoading && this.code) {
					this.onClear();
				}
			}
		};

		document.addEventListener('keydown', this._keyListener.bind(this));
	},
	created () {
		this.commands.clear = () => {
			this.setHistory([]);
			return createDummyStdout();
		};

		this.commands.help = () => {
			this.onHelp();
			return createDummyStdout();
		};

		this.commands['./bootstrap'] = ({ _ }) => {
			setTimeout(() => !_[1] && this.appendDummyOutput(), 300);
			return LiveIntro;
		};

		this.builtIn = (stdin) => {
			// filter out clear
			if (stdin === 'clear') {
				this.clearOutput();
				this.appendDummyOutput();
			}
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
	methods: {
		...mapActions(OUTPUT_MODULE, {
			resetImmudb: RESET_IMMUDB,
			resetMerkleTree: RESET_MERKLE_TREE,
			resetOutput: RESET_OUTPUT,
			appendCodeOutput: APPEND_CODE_OUTPUT,
			appendImmudb: APPEND_IMMUDB,
		}),
		...mapActions(LIVE_MODULE, {
			setInProgress: SET_IN_PROGRESS,
			setPrompt: SET_PROMPT,
			setTermStdin: SET_TERM_STDIN,
			setPointer: SET_POINTER,
			clearOutput: CLEAR_OUTPUT,
			appendDummyOutput: APPEND_DUMMY_OUTPUT,
			appendOutput: APPEND_OUTPUT,
			appendExecuted: APPEND_EXECUTED,
			setHistory: SET_HISTORY,
			setExecuted: SET_EXECUTED,
			setCommand: SET_COMMAND,
		}),
		...mapActions(WEBSOCKET_MODULE, {
			sendObj: SOCKET_OBJ_MESSAGE,
		}),
		onBuiltIn (stdin) {
			try {
				this.setInProgress(true);

				this.$nextTick(() => {
					this.setPointer(this.pointer + 1);
					this.appendExecuted(stdin);
				});

				// send message to WS
				this.sendObj({
					cmd: undefined,
					line: `${ stdin }\n`,
				});

				this.$nextTick(() => {
					this.setInProgress(false);
					this.scrollToBottom();
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
		onReset () {
			this.resetImmudb();
			this.resetMerkleTree();
			this.resetOutput();
			this.$toasted.info(this.$t('common.reset.success'), {
				duration: 5000,
			});
		},
		onClear () {
			const { terminal } = this.$refs;
			terminal && terminal.execute('clear');
		},
		onHelp () {
			if (this.isDefaultClient) {
				this.appendOutput({
					line: 'please issue the command \'immuclient\' to enter immuclient interactive mode or just issue \'immuclient --help\'',
					append: true,
				});
			}
			else {
				this.sendObj({
					cmd: undefined,
					line: 'help\n',
				});
			}
		},
		onBootstrap () {
			const { terminal } = this.$refs;
			terminal && terminal.execute(`./bootstrap${ this.intro.finished ? '' : ' _' }`);
			this.$nextTick(() => this.scrollToBottom());
		},
		onLogin () {
			if (!this.isDefaultClient) {
				// send login message to WS
				this.sendObj({
					cmd: undefined,
					line: 'login\n',
				});
			}
			else {
				this.appendOutput({
					line: 'command not allowed at this level',
					append: true,
				});
			}
		},
		onExit () {
			if (!this.isDefaultClient) {
				// send exit message to WS
				this.sendObj({
					cmd: undefined,
					line: 'exit\n',
				});
				/// TODO emit event to set live prompt
				this.setLivePrompt({
					prompt: DEFAULT_PROMPT,
				});
			}
			else {
				this.appendOutput({
					line: 'command not allowed at this level',
					append: true,
				});
			}
		},
		scrollToBottom () {
			// scroll to latest row
			const { terminal: { $el: el } } = this.$refs || {};
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
										word-break: break-word !important;
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
