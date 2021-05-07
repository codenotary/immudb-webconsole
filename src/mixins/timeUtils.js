// This line has changed. I think "* as Moment" is wrong.
import Moment from 'moment';

import { extendMoment } from 'moment-range';

// Current latest release has wrong type definition,
// so I put any casting to avoid errors.
const moment = extendMoment(Moment);

const NOW = 'now';

const SUBTRACT = '-';
const ADD = '+';

const YEAR = 'y';
const MONTH = 'M';
const WEEK = 'd';
const DAY = 'd';
const HOUR = 'h';
const MINUTE = 'm';

export default {
	name: 'timeUtils',
	data: () => ({
		format: 'YYYY/MM/DD hh:mm A',
		dateFormat: 'YYYY/MM/DD',
		timeFormat: 'hh:mm A',
	}),
	methods: {
		// Get methods
		timestampNow () {
			return moment().unix();
		},
		now (offset = false) {
			const now = moment().format(this.format);
			return offset ? now : now.split('+')[0];
		},
		getToday () {
			return moment()
					.startOf('day')
					.format(this.format)
					.split('+')[0];
		},
		getYesterday () {
			return moment()
					.startOf('day')
					.add(-1, 'days')
					.format(this.format)
					.split('+')[0];
		},
		getTomorrow () {
			return moment()
					.startOf('day')
					.add(1, 'days')
					.format(this.format)
					.split('+')[0];
		},
		getMoment (input) {
			return typeof input === 'string' ? moment(input, this.format) : moment(input);
		},
		getDate (input) {
			const result = typeof input === 'string' ? moment(input, this.format) : moment(input);
			return result.toDate();
		},
		getTimestampHash () {
			return Number(moment().unix() + Math.random() * 100).toString(32);
		},
		getTimezones () {
			return moment.tz.names();
		},

		// Utility methods
		disableWeekends (val) {
			const weekday = moment(val, this.format).format('dddd');
			return weekday !== 'Sunday' && weekday !== 'Saturday';
		},
		shortUnitComplete (unit) {
			switch (unit) {
				case HOUR: return 'hour';
				case DAY: return 'day';
				case WEEK: return 'week';
				case MONTH: return 'month';
				case YEAR: return 'year';
				default: return 'minute';
			}
		},
		minutesMissingTo(date, n, next) {
			const minute = date === 'string' ? moment(date).minute() : date.minute();
			const delta = minute - (Math.floor(minute / n) * n);
			return delta ? (next ? n - delta : delta) : n;
		},

		// Operation methods
		operation (date, amount, unit, type = ADD) {
			return type === ADD ? moment(date).add(amount, unit) : moment(date).subtract(amount, unit);
		},

		// Count methods
		dateDiff (start, end) {
			return (this.dateToTimestamp(end) - this.dateToTimestamp(start)) / 3600;
		},
		numberOfDays (start, end) {
			const s = typeof start === 'string' ? moment(start, this.format) : moment(start);
			const e = typeof end === 'string' ? moment(end, this.format) : moment(end);
			return e.diff(s) + 1;
		},
		numberOfWorkHours (start, end, workHours = 8) {
			return this.numberOfDays(start, end) * workHours;
		},

		// Check methods
		isSameOrAfter (date1, date2) {
			const d1 = typeof date1 === 'string' ? moment(date1, this.format) : moment(date1);
			const d2 = typeof date2 === 'string' ? moment(date2, this.format) : moment(date2);
			return d1.isSameOrAfter(d2);
		},
		isSameOrBefore (date1, date2) {
			const d1 = typeof date1 === 'string' ? moment(date1, this.format) : moment(date1);
			const d2 = typeof date2 === 'string' ? moment(date2, this.format) : moment(date2);
			return d1.isSameOrBefore(d2);
		},
		startIsBeforeEnd (start, end) {
			const s = typeof start === 'string' ? moment(start, this.format) : moment(start);
			const e = typeof end === 'string' ? moment(end, this.format) : moment(end);
			return s.isSameOrBefore(e);
		},
		dateIsValid (date) {
			const formatValid = moment(date, this.format, true).isValid();
			const dateFormatValid = moment(date, this.dateFormat, true).isValid();
			return formatValid || dateFormatValid;
		},
		unitIsValid (unit) {
			return unit === MINUTE || unit === HOUR || unit === DAY || unit === WEEK || unit === MONTH || unit === YEAR;
		},

		// Range methods
		lastNUnit(date, n, unit) {
			const _date = !date ? this.now() : typeof date === 'string' ? moment(date) : date;
			const range = moment.rangeFromInterval(unit, n, _date);
			const customRange = this.customRange(range.start, range.end);
			return customRange;
		},

		// Format methods
		customRange (start, end) {
			const _start = this.getMoment(start);
			const _end = this.getMoment(end);
			if (_start && _end) {
				return {
					start: {
						label: this.printDate(_start),
						value: this.formatDate(_start, 'full', true),
					},
					end: {
						label: this.printDate(_end),
						value: this.formatDate(_end, 'full', true),
					},
				};
			}
		},
		formatDate (value, format = 'full', iso = false) {
			let m = typeof value === 'string' ? moment(value) : value;
			m.constructor.name === 'Date' && (m = moment(new Date(value)));
			const useFormat = format === 'full'
				? this.format
				: format === 'date'
					? this.dateFormat
					: this.timeFormat;
			if (iso) {
				return m.toISOString();
			}
			console.log(m, format);
			return m.format(useFormat).split('+')[0];
		},
		parseComplexString (value) {
			try {
				// if value is simply now, returns current date
				if (value === NOW) {
					return this.now();
				}
				else {
					let newDate = null;
					let _validString = false;
					let _validNow = false;
					let _validOperation = false;
					let _validExpression = false;
					let _validAmount = false;
					let _validTimeUnit = false;
					let _validDate = false;

					try {
						// get expression operations ('+' or '-')
						const operation = value.includes(SUBTRACT) ? SUBTRACT : ADD;
						// split expression by operation
						const expr = value.split(operation);
						const amount = expr[1].slice(0, -1);
						const unit = expr[1].slice(-1);
						newDate = this.operation(this.now(), amount, this.shortUnitComplete(unit), operation);

						_validString = value && typeof value === 'string';
						_validNow = expr && typeof expr[0] === 'string' && expr[0].toLowerCase() === NOW;
						_validOperation = operation === ADD || operation === SUBTRACT;
						_validExpression = expr[1] && typeof expr[1] === 'string';
						_validAmount = !/\D/.test(amount); // check if the amount contain only digits
						_validTimeUnit = this.unitIsValid(unit); // check if the unit is one of m, h, d, w, M or Y
						_validDate = this.dateIsValid(newDate); // check if the calculated date is valid
					}
					catch (err) {
						console.error('parseComplexString error', err);
					}

					if (newDate && _validString && _validNow && _validOperation && _validExpression && _validAmount && _validTimeUnit && _validDate) {
						return this.timestampToString(newDate);
					}
					else if (!_validString) {
						return { error: 'Please enter a valid date' };
					}
					else if (!_validNow) {
						return { error: 'Please enter a past date or \'now\'' };
					}
					else if (!_validOperation) {
						return { error: 'Please enter a valid operation (+ or -)' };
					}
					else if (!_validExpression) {
						return { error: 'Please enter a valid expression' };
					}
					else if (!_validAmount) {
						return { error: 'Please enter a valid amount' };
					}
					else if (!_validTimeUnit) {
						return { error: 'Please enter a valid time unit (m, h, d, w, M or Y)' };
					}
					else if (!_validDate) {
						console.error('Operation returned invalid date');
						return this.now();
					}
				}
			}
			catch (err) {
				console.error('parseComplexString error', err);
			}
		},

		// Print methods
		dateToTimestamp (value) {
			return typeof value === 'number' ? value : moment(value, this.format).unix() * 1e3;
		},
		timestampToString (value, format = 'full') {
			const useFormat = format === 'full' ? this.format : (format === 'date' ? this.dateFormat : this.timeFormat);
			return moment.unix(value / 1e3).format(useFormat).split('+')[0];
		},
		timestampToDate (value) {
			return moment.unix(value / 1e3);
		},
		printDate (value) {
			return typeof value === 'string' ? value : this.timestampToString(value);
		},
		nth (d) {
			return d > 3 && d < 21
				? 'th'
				: ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
		},
		timeAgo (date) {
			const d = typeof date === 'string' ? moment(date, this.format) : moment(date);
			return d.fromNow();
		},
	},
};
