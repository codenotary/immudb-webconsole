module.exports = {
	globals: {
		XPay: true,
	},
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/recommended',
	],
	// add your custom rules here
	rules: {
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		indent: ['warn', 'tab', {
			SwitchCase: 1,
			MemberExpression: 2,
		}],
		'space-before-function-paren': 'off',
		'no-tabs': 'off',
		'brace-style': ['error', 'stroustrup'],
		'comma-dangle': [
			'warn', {
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'always-multiline',
			},
		],
		'vue/no-v-html': 'off',
		'vue/html-indent': ['warn', 'tab', {
			baseIndent: 1,
			attribute: 1,
		}],
		'vue/max-attributes-per-line': ['warn', {
			singleline: 2,
			multiline: {
				max: 2,
			},
			allowFirstLine: false,
		}],
		'vue/html-closing-bracket-newline': ['warn', {
			multiline: 'always',
			singleline: 'never',
		}],
		'template-curly-spacing': ['error', 'always'],
		'no-console': 'off', // TODO: turn on
		'no-debugger': 'off',
		'vue/require-component-is': 'off',
		'spaced-comment': 'warn',
		'vue/no-unused-vars': 'warn',
		'no-trailing-spaces': 'warn',
		'no-multiple-empty-lines': 'warn',
		'padded-blocks': 'warn',
	},
};
