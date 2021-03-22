const calculateId = (parent, child) => {
	let id = '';
	if (!!parent && typeof parent === 'string') {
		id = parent.toLowerCase();
	}
	if (!!child && typeof child === 'string') {
		id = id
			? `${ id }/${ child.toLowerCase() }`
			: child.toLowerCase();
	}
	id = id && id.replace(/\s+/g, '_');
	return id;
};

export default calculateId;
