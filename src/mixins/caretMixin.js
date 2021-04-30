export const caretMixin = {
	name: 'caretMixin',
	methods: {
		getCaretPosition (el) {
			try {
				const { selection } = el;
				if (selection) {
					return {
						start: selection.start,
						end: selection.end,
					};
				}
				else {
					return 0;
				}
			}
			catch (err) {
				console.error(err);
			}
		},
		moveCaret(el, position) {
			try {
				const { selection } = el;
				if (selection) {
					selection && (el.selection.start = el.selection.end = position);
				}
				else {
					el.selection = window.getSelection();
				}
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
