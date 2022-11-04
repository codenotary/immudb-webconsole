export default {
	title: 'immudb webconsole',
	banner: {
		title: 'Star immudb on github',
	},
	common: {
		codenotary: 'CodeNotary',
		poweredBy: 'Powered by',
		gopher: 'CodeNotary Gopher',
		immudb: 'immudb',
		andTopic: 'And',
		all: 'All',
		or: 'Or',
		run: 'run',
		active: 'Active',
		deactive: 'Deactive',
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
		username: 'Username',
	},
	permissions: {
		255: 'System admin',
		254: 'Admin',
		0: 'None',
		1: 'Read',
		2: 'Read & write',
		short: {
			255: 'sysadmin',
			254: 'admin',
			0: 'none',
			1: 'r',
			2: 'rw',
		},
	},
	splash: {
		title: 'immudb',
	},
	login: {
		subtitle: 'Please login to continue',
		label: {
			username: 'Username',
			password: 'Password',
		},
		placeholder: {
			username: 'Insert immudb username',
			password: 'Insert immudb password',
		},
		hint: {
			username: 'Default username is: immudb',
			password: 'Default password is: immudb',
		},
		submit: 'Login',
	},
	sidebar: {
		dashboard: 'Metrics',
		query: 'Query',
		databases: 'Databases',
		users: 'Users',
		settings: 'Settings - coming soon',
		guide: 'Guide - coming soon',
	},
	profile: {
		preferences: {
			title: 'Preferences',
			label: 'Preferences',
			alt: 'Profile preferences',
			tooltip: 'Profile preferences',
		},
		timezone: {
			label: 'Timezone',
			placeholder: 'Select favourite timezone',
			values: {
				local: 'Browser',
				UTC: 'UTC',
			},
			tooltip: 'The timezone will influence how dates appear in the webconsole',
			successMessage: 'Timezone preference updated successfully!',
		},
		themeToogle: {
			title: 'Toggle theme',
			label: 'Toggle {value} theme',
			alt: 'Toggle theme',
			tooltip: 'Toggle theme',
		},
		logout: {
			label: 'Log out',
			alt: 'Log out from immudb webconsole',
			tooltip: 'Log out',
		},
	},
	metrics: {
		title: 'Metrics of:',
		multidatabaseComingSoon: 'Multidatabase metrics coming soon',
		info: 'The following metrics are updated every {value}',
		dbUptimeHours: {
			title: 'Uptime',
		},
		dbEntries: {
			title: 'Number of entries',
		},
		dbSize: {
			title: 'Database size: {size}',
		},
		memoryUsage: {
			title: 'Memory usage: {reserved} reserved, {inUse} in use',
			reserved: {
				label: 'Memory reserved',
			},
			inUse: {
				label: 'Memory in use',
			},
		},
		readAndWrite: {
			title: 'Reads and writes: {reads}/{writes} ',
		},
	},
	query: {
		tables: {
			title: 'Tables of:',
			table: 'Table',
			tab: 'Table',
			row: 'Row',
			col: 'Column',
			column: 'Column',
			view: 'View',
			primaryKey: 'Column is Primary key',
			foreignKey: 'Column is Foreign key',
			indexed: 'Column is indexed',
			nullable: 'Column is Nullable',
			activeDB: 'Database:',
			add: {
				button: 'add',
				alt: 'Add \'{value}\' to sql query',
				tooltip: 'Add \'{value}\' to sql query',
				notAllowed: 'As you do not have permissions to write on this database it is suggested to ask the <span class="font-weight-bold">sysadmin</span> to add some data.',
			},
			empty: {
				label: 'The active database is empty.',
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
				tooltipAll: 'Run All SQL queries',
				tooltipDisabled: 'A SQL query is required',
				loading: 'Running',
				command: 'SQL Command executed successfully!',
			},
			clear: {
				button: 'Clear',
				alt: 'Clear query',
				tooltip: 'Clear query',
				success: 'Query cleared',
			},
			timetravelComingSoon: 'Time travel feature coming soon',
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
			clear: {
				button: 'Clear',
				alt: 'Clear output',
				tooltip: 'Clear output',
				success: 'Output cleared',
			},
		},
		timetravel: {
			past: 'This query has been made with a previous TxID',
			present: 'This query has been made with the latest TxID',
		},
	},
	databases: {
		title: 'Manage databases',
		action: {
			add: {
				title: 'Add database',
				button: 'Add database',
				alt: 'Add database',
				tooltip: 'Add database',
				loading: 'Creating',
				success: 'Database added',
			},
		},
		modal: {
			add: {
				title: 'Add database',
				databaseName: 'Database name',
			},
		},
		table: {
			databaseName: 'Database name',
			active: 'Active',
			action: {
				use: {
					label: 'Set this database as active one',
					tooltip: 'Set database {database} as active one',
					alt: 'Set database {database} as active one',
					success: 'Database successfully set as active!',
				},
			},
			modal: {
				use: {
					title: 'Set database {database} as active one',
					sure: 'This database will be used for query operations.',
					success: 'Database successfully set as active!',
				},
			},
		},
		search: {
			label: 'Filter',
			placeholder: 'Filter by database name',
			tooltip: 'Filter database table by database name',
		},
	},
	users: {
		title: 'Manage users',
		active: 'Active',
		notActive: 'Not active',
		action: {
			add: {
				title: 'Add user',
				button: 'Add user',
				alt: 'Add user',
				tooltip: 'Add user',
				loading: 'Creating',
				success: 'User added',
			},
			hideNotActive: {
				label: 'Hide inactive users',
				tooltip: {
					hide: 'Hide inactive users',
					show: 'Show inactive users',
				},
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
			status: 'Status',
			action: {
				deactivate: {
					label: 'Deactivate user',
					tooltip: 'Deactivate user {user}',
					alt: 'Deactivate user {user}',
					success: 'User successfully deactivated!',
				},
				activate: {
					label: 'Activate user',
					tooltip: 'Activate user {user}',
					alt: 'Activate user {user}',
					success: 'User successfully activated!',
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
			permissions: {
				title: 'Permissions',
				database: 'Database',
				permission: 'Permission',
				add: {
					title: 'Add permission for user {user}',
					label: 'Add permission',
					button: 'Add',
					tooltip: 'Add permission for user {user}',
					alt: 'Add permission',
					success: 'User permission successfully added!',
				},
				remove: {
					title: 'Remove permission {value} for user {user}',
					label: 'Remove permission',
					sure: 'Are you sure you want to <span class="font-weight-bold">remove</span> this permission?',
					button: 'Remove',
					tooltip: 'Remove permission {value} for user {user}',
					alt: 'Remove permission',
					success: 'User permission {value} successfully remove!',
				},
				edit: {
					title: 'Edit permission {value} for user {user}',
					label: 'Edit permission',
					button: 'Edit',
					tooltip: 'Edit permission {value} for user {user}',
					alt: 'Edit permission',
					success: 'User permission {value} successfully edited!',
				},
			},
			modal: {
				deactivate: {
					title: 'Deactivate user {user}',
					sure: 'Are you sure you want to <span class="font-weight-bold">deactivate</span> this user?',
					success: 'User successfully deactivated!',
				},
				activate: {
					title: 'Activate user {user}',
					sure: 'Are you sure you want to <span class="font-weight-bold">activate</span> this user?',
					success: 'User successfully activated!',
				},
				updatePassword: {
					title: 'Change password for user {user}',
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
		buildTime: 'Last build at {date}',
		version: {
			prepend: 'v',
			tooltip: {
				immudb: {
					short: 'immudb: v{version}',
					normal: 'immudb: v{version}',
					withHash: 'immudb: v{version} (git {hash})',
				},
				webconsole: {
					short: 'ws: v{version}',
					normal: 'webconsole: v{version}',
					withHash: 'webconsole: v{version} (git {hash})',
				},
			},
		},
		feedback: {
			text: 'Feedback',
			tooltip: 'Something went wrong or have an idea in mind? Let us know on GitHub!',
		},
		devMode: {
			label: 'Dev mode',
			tooltip: 'The webconsole is running in development mode',
		},
		github: {
			label: '1800',
			tooltip: 'See OS code on github repository',
		},
		discord: {
			tooltip: 'Ask for help in our Discord channel.',
		},
	},
	somethingWentWrong: 'Something went wrong',
	dockerTokenExpired: 'Session expired, starting a new one',
	unabletoCommunicateWithImmudb: 'Unable to communicate with immudb. Is it down?',
};
