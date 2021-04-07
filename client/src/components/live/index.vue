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
				@keydown.ctrl.72="onHelp"
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
import { mapActions } from 'vuex';
import { createStdout, createStderr, createDummyStdout } from 'vue-command';
import {
	mdiConsoleLine,
} from '@mdi/js';
import {
	OUTPUT_MODULE,
	APPEND_CODE_OUTPUT,
	APPEND_IMMUDB,
} from '@/store/output/constants';
import LiveIntro from '@/components/live/Intro';

const WS_PROMPT = 'bash-5.1#';

export default {
	name: 'Live',
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			prompt: WS_PROMPT,
			introFinished: true,
			commands: {
				intro: () => undefined,
				clear: () => undefined,
			},
			builtIn: undefined,
			isInProgress: false,
			termStdin: './immudb -d',
			pointer: 0,
			executed: new Set(),
			history: [],
			helpText: 'Type help',
			helpTimeout: 5000,
			// provide data
			intro: {
				value: '',
			},
		};
	},
	computed: {
		hidePrompt () {
			return !this.introFinished;
		},
		showPrompt () {
			return this.promp === WS_PROMPT;
		},
	},
	mounted () {
		// init the live terminal with a LiveIntro component
		this.$nextTick(() => this.onIntro());

		// increase show help timeout
		setTimeout(() => {
			this.helpTimeout = 15000;
		}, this.helpTimeout + 1);

		this.introFinished = false;

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

		this.commands.immudb = () => {
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

		if (this.$refs.vueCommand) {
			this.$refs.vueCommand.scroll.resizeObserver
					.disconnect();
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
			appendImmudb: APPEND_IMMUDB,
		}),
		getPrompt (data) {
			return data;
		},
		parseMsg (data) {
			const { line, tree, token, verified } = data;

			// update merkle tree output
			(tree || token) && this.appendImmudb({
				immudb: tree,
				token,
				verified,
			});

			// updated code output
			data && this.appendCodeOutput(data);

			if (line) {
				const chunks = line.split('\r\n');

				// parse msg
				if (line === '--MARK--\n') {
					this.introFinished = true;
					this.intro.value += '<br>';
				}
				else if (chunks && chunks.length > 2 && !line.endsWith('\n')) {
					const idx = line.lastIndexOf('\r\n');
					this.parseMsg({ line: `${ line.substring(0, idx) }\n` });
					this.parseMsg({ line: line.substring(idx, line.length) });
				}
				else if (!line.endsWith('\n')) {
					this.prompt = line;

					this.history
							.push(createDummyStdout());
				}
				else if (/^\s*$/.test(line)) {
					// console.error('SKIP: just new line');
				}
				else {
					// reset default prompt
					this.prompt = WS_PROMPT;

					// append live terminal output
					if (this.introFinished) {
						this.appendOutput(line);
					}
					else {
						this.appendIntro(line);
					}

					// scroll to latest row
					const { terminal: { $el: el } } = this.$refs;
					if (el) {
						this.$nextTick(() => {
							el.scrollTop = el.scrollHeight;
						});
					}
				}
			}
		},
		appendIntro (line, stderr = false) {
			try {
				const m = this.intro.value ? 8 : 0;
				const classname = stderr ? 'stderr' : 'stdout';
				const newLine = `<span class="ma-0 mb-${ m } pa-0 ${ classname }">${ line }</span>`;
				this.intro.value += newLine;
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
								? createStderr(line.trim(), false, false)
								: createStdout(line.trim(), false, false, false),
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
					// console.log(terminal);
					// this.executed.add(stdin);
					terminal && terminal.executed.add(stdin);
				});

				// send message to WS
				this.$socket && this.$socket.sendObj({
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
		onHelp () {
			this.$socket && this.$socket.sendObj({
				cmd: undefined,
				line: 'immuclient help\n',
			});
		},
		onIntro () {
			const { terminal } = this.$refs;
			terminal && terminal.execute('immudb');
		},
		onLogin () {
			if (this.prompt !== WS_PROMPT) {
				// send login message to WS
				this.$socket && this.$socket.sendObj({
					cmd: undefined,
					line: 'login\n',
				});
			}
			else {
				this.appendOutput('command not allowed at this level', true);
			}
		},
		onExit () {
			if (this.prompt !== WS_PROMPT) {
				// send exit message to WS
				this.$socket && this.$socket.sendObj({
					cmd: undefined,
					line: 'exit\n',
				});
				this.prompt = WS_PROMPT;
			}
			else {
				this.appendOutput('command not allowed at this level', true);
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
