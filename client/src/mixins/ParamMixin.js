export const PARAMS = {
	ID: 'id',
	AUTH: 'auth',
	ERROR: 'error',
	ERROR_DESCRIPTION: 'error_description',
	ERROR_URI: 'error_uri',
	STATE: 'state',
	CODE: 'code',
};

export const ParamMixin = {
	name: 'ParamMixin',
	methods: {
		getParam (param) {
			return this.$route && this.$route.query[param];
		},
		setParam (param, value) {
			if (this.$route && this.getParam(param) !== value) {
				const randomKey = Math.random();
				const query = Object.assign({}, this.$route.query, { [param]: value, _rk: randomKey });
				this.$router.push({ query }).catch(err => err);
			}
		},
		deleteParam (param) {
			if (this.$route && this.getParam(param)) {
				const query = Object.assign({}, this.$route.query);
				delete query[param];
				const randomKey = Math.random();
				this.$router.push({ query, _rk: randomKey });
			}
		},
	},
};
