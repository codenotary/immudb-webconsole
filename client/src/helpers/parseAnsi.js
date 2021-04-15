import AnsiUp from 'ansi_up';
const StripAnsi = require('strip-ansi');

const parseAnsi = (data, ansi = true) => {
	if (data) {
		if (ansi) {
			const ansiUp = new AnsiUp();
			ansiUp.use_classes = true;
			return ansiUp.ansi_to_html(data.replace(/\s+$/, ''));
		}
		else {
			return StripAnsi(data.replace(/\s+$/, ''));
		}
	}
	return '';
};

export default parseAnsi;
