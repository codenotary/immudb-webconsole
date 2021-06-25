export const caretMixin = {
	name: 'caretMixin',
	methods: {
		getCaretPosition (el) {
			try {
				const { selection } = el;
				if (selection) {
					const { start, end } = selection;
					return { start, end };
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
				setTimeout(() => {
					if (selection) {
						el.selection.start = el.selection.end = position;
					}
					else {
						el.selection = window.getSelection();
					}
				}, 300);
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
