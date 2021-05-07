export default {
	title: 'immudb webconsole',
	banner: {
		title: 'Star immudb on github',
	},
	common: {
		codenotary: 'CodeNotary',
		immudb: 'immudb',
		andTopic: 'And',
		or: 'Or',
		run: 'run',
		clear: 'clear',
		cancel: 'cancel',
		confirm: 'confirm',
		load: 'load',
		reset: 'reset',
		loading: 'loading',
		running: 'running',
		search: 'search',
		filter: 'filter',
		moreInfo: 'more info',
		comingSoon: 'Coming soon',
	},
	login: {
		title: 'Please login first',
		label: {
			username: 'Username',
			password: 'Password',
		},
		placeholder: {
			username: 'Insert immudb username',
			password: 'Insert immudb password',
		},
		submit: 'Login',
	},
	sidebar: {
		dashboard: 'Dashboard',
		query: 'Query',
		databases: 'Databases',
		users: 'Users',
		settings: 'Settings',
		guide: 'Guide',
		logout: {
			label: 'logout',
			alt: 'Logout from immudb',
		},
	},
	analytics: {
		title: 'Analytics',
	},
	query: {
		tables: {
			title: 'Tables',
			table: 'Table',
			tab: 'Table',
			row: 'Row',
			col: 'Column',
			column: 'Column',
			view: 'View',
			primaryKey: 'Primary key',
			activeDB: 'Database:',
			add: {
				button: 'add',
				alt: 'Add \'{value}\' to sql query',
				tooltip: 'Add \'{value}\' to sql query',
			},
			empty: {
				label: 'The current database is empty.',
				button: 'add demo data',
			},
		},
		input: {
			title: 'SQL Query',
			snapshot: {
				label: 'Travel in time',
				alt: 'Travel in time',
				placeholder: 'Travel in time',
			},
			present: 'Present',
			run: {
				button: 'Run',
				alt: 'Run SQL query',
				tooltip: 'Run SQL query',
				loading: 'Running',
			},
			clear: {
				button: 'Clear',
				alt: 'Clear query',
				tooltip: 'Clear query',
				success: 'Query cleared',
			},
		},
		output: {
			filter: {
				label: 'filter by severity',
			},
			grid: {
				title: 'Output',
				empty: 'There is no output yet...',
				present: 'Present',
				timeTravel: 'Travelled in time',
			},
		},
	},
	users: {
		title: 'Manage users',
		action: {
			add: {
				title: 'Add user',
				button: 'Add user',
				alt: 'Add user',
				tooltip: 'Add user',
				loading: 'Creating',
				success: 'User added',
			},
		},
		modal: {
			add: {
				title: 'Add user',
				username: 'Username',
				password: 'Password',
				permission: 'Permission',
				database: 'Database',
			},
		},
		table: {
			user: 'User',
			createdBy: 'Created by',
			createdAt: 'Created at',
			active: 'Active',
			action: {
				disable: {
					label: 'Disable user',
					tooltip: 'Disable user {user}',
					alt: 'Disable user {user}',
					success: 'User successfully disabled!',
				},
				enable: {
					label: 'Enable user',
					tooltip: 'Enable user {user}',
					alt: 'Enable user {user}',
					success: 'User successfully enabled!',
				},
				updatePassword: {
					label: 'Change password',
					tooltip: 'Change password',
					alt: 'Change password',
					success: 'User password successfully changed!',
				},
				updatePermissions: {
					label: 'Change permissions',
					tooltip: 'Change permissions',
					alt: 'Change permissions',
					success: 'User permissions successfully changed!',
				},
			},
			modal: {
				disable: {
					title: 'Disable user {user}',
					sure: 'Are you sure you want to <span class="font-weight-bold">disable</span> this user?',
					success: 'User successfully disabled!',
				},
				enable: {
					title: 'Enable user {user}',
					sure: 'Are you sure you want to <span class="font-weight-bold">enable</span> this user?',
					success: 'User successfully enabled!',
				},
				updatePassword: {
					title: 'Change password of user {user}',
					oldPassword: 'Old password',
					newPassword: 'New password',
					confirmPassword: 'Confirm password',
					success: 'User\'s password successfully updated!',
				},
				updatePermissions: {
					title: 'Change permissions of user {user}',
					success: 'User\'s permissions successfully updated!',
				},
			},
		},
		search: {
			label: 'Filter',
			placeholder: 'Filter by user',
			tooltip: 'Filter user table by user',
		},
	},
	settings: {
		title: 'Settings',
	},
	guide: {
		title: 'Gudie',
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
};
