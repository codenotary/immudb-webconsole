const deepFind = (data, searchProperty = 'id', recursionProperty = 'children', value) => {
	let result;
	if (data && data.length) {
		data.find((_) => {
			let check = _[searchProperty];
			!check.startsWith('/') && (check = `/${ check }`);
			if (check === value) {
				result = _;
			}
			else if (Array.isArray(_[recursionProperty]) && _[recursionProperty].length > 0) {
				const recursion = deepFind(_[recursionProperty], searchProperty, recursionProperty, value);
				!!recursion && (result = recursion);
			}
		});
	}
	return result;
};

export default deepFind;
