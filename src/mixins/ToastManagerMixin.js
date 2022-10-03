const GENERIC_SUCCESS_I18N = 'somethingWentSuccessfull';
const GENERIC_ERROR_I18N = 'somethingWentWrong';
const DOCKER_TOKEN_ERROR_I18N = 'dockerTokenExpired';
const GENERIC_SUCCESS_ICON = 'check-circle';
const GENERIC_ERROR_ICON = 'times-circle';
const DOCKER_TOKEN_ERROR_ICON = 'new-box';
const DEFAULT_DURATION = 5000;

export default {
	name: 'ToastManagerMixin',
	methods: {
		showToastInfo(msg) {
			if (msg) {
				if (this.$te(msg)) {
					this.$toasted.info(this.$t(msg), {
						icon: GENERIC_SUCCESS_ICON,
						duration: DEFAULT_DURATION,
					});
				}
				else {
					this.$toasted.info(msg, {
						icon: GENERIC_SUCCESS_ICON,
						duration: DEFAULT_DURATION,
					});
				}
			}
			else {
				this.$toasted.info(this.$t(GENERIC_SUCCESS_I18N), {
					icon: GENERIC_SUCCESS_ICON,
					duration: DEFAULT_DURATION,
				});
			}
		},
		showToastSuccess(msg) {
			if (msg) {
				if (this.$te(msg)) {
					this.$toasted.success(this.$t(msg), {
						icon: GENERIC_SUCCESS_ICON,
						duration: DEFAULT_DURATION,
					});
				}
				else {
					this.$toasted.success(msg, {
						icon: GENERIC_SUCCESS_ICON,
						duration: DEFAULT_DURATION,
					});
				}
			}
			else {
				this.$toasted.success(this.$t(GENERIC_SUCCESS_I18N), {
					icon: GENERIC_SUCCESS_ICON,
					duration: DEFAULT_DURATION,
				});
			}
		},
		showToastError(err, statuses = [400, 401, 403, 404, 405, 406, 410, 422, 500, 502, 503]) {
			if (this.$te(err)) { // if err is a $i18n key
				this.$toasted.error(this.$t(err), {
					icon: GENERIC_ERROR_ICON,
					duration: DEFAULT_DURATION,
				});
			}
			else if (err && err.response && err.response.data && err.response.data.error) {
				const { status } = err.response || {};
				if ([406, 410].includes(status)) {
					this.$toasted.info(this.$t(DOCKER_TOKEN_ERROR_I18N), {
						icon: DOCKER_TOKEN_ERROR_ICON,
						duration: DEFAULT_DURATION,
					});
				}
				else if (statuses.includes(status)) {
					const message =
					err.response.data.error.charAt(0).toUpperCase() +
					err.response.data.error.slice(1) + '.';
					this.$toasted.error(message, {
						icon: GENERIC_ERROR_ICON,
						duration: DEFAULT_DURATION,
					});
				}
				else {
					this.$toasted.error(this.$t(GENERIC_ERROR_I18N), {
						icon: GENERIC_ERROR_ICON,
						duration: DEFAULT_DURATION,
					});
				}
			}
			else if (err && err.response && [406, 410].includes(err.response.status)) {
				this.$toasted.info(this.$t(DOCKER_TOKEN_ERROR_I18N), {
					icon: DOCKER_TOKEN_ERROR_ICON,
					duration: DEFAULT_DURATION,
				});
			}
			else if (err?.response?.status === 504) {

			}
			else {
				this.$toasted.error(this.$t(GENERIC_ERROR_I18N), {
					icon: GENERIC_ERROR_ICON,
					duration: DEFAULT_DURATION,
				});
			}
		},
	},
};
