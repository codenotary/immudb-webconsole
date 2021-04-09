import { mapActions } from 'vuex';
import { createStdout, createStderr, createDummyStdout } from 'vue-command';
import {
	LIVE_MODULE,
	SET_PROMPT,
	SET_INTRO,
} from '@/store/live/constants';
import LiveIntro from '@/components/live/Intro';
const AnsiToHtml = require('ansi-to-html');

export default {
	name: 'LiveTerminalMixin',
	mounted () {
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
	methods: {
		...mapActions(LIVE_MODULE, {
			setLivePrompt: SET_PROMPT,
			setLiveIntro: SET_INTRO,
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
						prompt: line,
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
		parseLine (line) {
			const ansi = new AnsiToHtml();
			return ansi.toHtml(line.trim(), {
				fg: '#FFF',
				bg: '#000',
				newline: true,
				escapeXML: true,
				stream: true,
			});
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
	},
};