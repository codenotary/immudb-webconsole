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
		moreInfo: 'more info',
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
	live: {
		title: 'Live',
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
				info: 'Merkle tree info',
				tooltip: {
					resetZoom: 'Reset zoom',
					info: 'A Merkle tree (or hash tree) is a tree in which every leaf node is labelled with the cryptographic hash of a data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.',
				},
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
