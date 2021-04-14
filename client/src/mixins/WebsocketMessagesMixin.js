import { mapActions, mapGetters } from 'vuex';
import {
	OUTPUT_MODULE,
	APPEND_CODE_OUTPUT,
	APPEND_IMMUDB,
} from '@/store/output/constants';
import {
	LIVE_MODULE,
	SET_INTRO,
	SET_PROMPT,
	APPEND_DUMMY_OUTPUT,
	APPEND_OUTPUT,
	APPEND_EXECUTED,
	INTRO,
	DEFAULT_PROMPT,
} from '@/store/live/constants';
import {
	MESSAGE_TYPES,
} from '@/store/websocket/constants';
import parseAnsi from '@/helpers/parseAnsi';

const INTRO_END_MSG = '--MARK--\n';

export default {
	name: 'WebsocketMessagesMixin',
	computed: {
		...mapGetters(LIVE_MODULE, {
			intro: INTRO,
		}),
	},
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
		...mapActions(OUTPUT_MODULE, {
			appendCodeOutput: APPEND_CODE_OUTPUT,
			appendImmudb: APPEND_IMMUDB,
		}),
		...mapActions(LIVE_MODULE, {
			setPrompt: SET_PROMPT,
			setIntro: SET_INTRO,
			appendDummyOutput: APPEND_DUMMY_OUTPUT,
			appendOutput: APPEND_OUTPUT,
			appendExecuted: APPEND_EXECUTED,
		}),
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

			// updated store output code
			data && this.appendCodeOutput(data);

			if (line) {
				const chunks = line
						.split('\r\n')
						.filter(_ => _ !== '\r\n')
						.filter(_ => !!_);

				// parse msg
				if (line === INTRO_END_MSG) {
					const { value } = this.intro || { value: '' };
					this.setIntro({
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
					this.setPrompt({
						prompt: line,
					});
					this.appendDummyOutput();
				}
				else if (/^\s*$/.test(line)) {
					// console.error('SKIP: just new line');
				}
				else {
					// reset default prompt
					this.setPrompt({
						prompt: DEFAULT_PROMPT,
					});

					// append live terminal output
					if (this.intro.finished) {
						this.$nextTick(() => this.appendOutput({ line }));
					}
					else {
						this.parseIntro(line);
					}
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
		parseIntro (line) {
			try {
				const { value } = this.intro || { value: '' };
				this.setIntro({
					value: `${ value }${ parseAnsi(line) }<br>`,
				});
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
