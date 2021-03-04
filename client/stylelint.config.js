module.exports = {
	extends: [
		'stylelint-config-standard',
	],
	// add your custom config here
	// https://stylelint.io/user-guide/configuration
	rules: {
		indentation: 'tab',
		'selector-pseudo-element-no-unknown': null,
		'no-descending-specificity': null,
		'at-rule-no-unknown': null,
		'font-family-no-missing-generic-family-keyword': null,
	},
};
