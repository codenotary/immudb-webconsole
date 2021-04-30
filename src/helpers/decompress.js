const pako = require('pako');

const decompress = (data) => {
	// Decode base64 (convert ascii to binary)
	const strData = atob(data);

	// Convert binary string to character-number array
	const charData = strData
			.split('')
			.map(_ => _.charCodeAt(0));

	// Turn number array into byte-array
	const binData = new Uint8Array(charData);

	// Pako magic
	const pakoData = pako.inflate(binData);

	// Convert gunzipped byteArray back to ascii string:
	return String.fromCharCode.apply(null, new Uint16Array(pakoData));
};

export default decompress;
