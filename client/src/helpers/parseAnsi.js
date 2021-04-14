const AnsiToHtml = require('ansi-to-html');

const parseAnsi = (data) => {
	if (data) {
		const ansi = new AnsiToHtml();
		return ansi.toHtml(data.trim(), {
			fg: '#FFF',
			bg: '#000',
			newline: true,
			escapeXML: true,
			stream: true,
		});
	}
	return '';
};

export default parseAnsi;
