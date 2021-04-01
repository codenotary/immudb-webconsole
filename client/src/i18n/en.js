export default {
	title: 'immudb playground',
	common: {
		codenotary: 'CodeNotary',
		immudb: 'immudb',
		andTopic: 'And',
		or: 'Or',
		run: 'run',
		load: 'load',
		loading: 'loading',
		running: 'running',
		search: 'search',
		filter: 'filter',
	},
	sidebar: {
		dashboard: 'Dashboard',
		documentation: 'Documentation',
		analytics: 'Analytics',
		download: 'Download immudb-py',
	},
	footer: {
		text: 'Copyright © {date} {url} All rights reserved.',
		devMode: 'Dev mode',
		github: 'See OS code on github repository',
		toggle: {
			dark: 'Toggle light theme',
			light: 'Toggle dark theme',
		},
		buildTime: 'Last build at {date}',
	},
	topic: {
		title: 'Topic',
		reference: {
			title: 'Reference',
		},
	},
	guide: {
		title: 'Guide',
	},
	code: {
		title: 'Code',
		run: 'Execute code (shortcut: Ctrl + Enter)',
		reset: 'Reset immudb (shortcut: Ctrl + r)',
		unknown: 'Code block type unknown',
		seeInDocumentation: 'See in documentation',
	},
	output: {
		title: 'Output',
		code: {
			title: 'Output',
			empty: 'There is no code output yet...',
			filter: {
				label: 'Filter output',
			},
		},
		merkleTree: {
			title: 'Merkle tree',
			empty: 'There is no merkle tree yet...',
			selector: {
				graph: 'Graph',
				json: 'Json',
			},
			commands: {
				resetZoom: 'Reset zoom',
			},
		},
		metrics: {
			verified: 'Verified',
			notVerified: 'not verified',
			tooltip: {
				verified: 'The merkle tree has been successfully verified',
				notVerified: 'The merkle tree is in an unverified state',
			},
		},
	},
};
