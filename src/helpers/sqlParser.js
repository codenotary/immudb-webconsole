import {
	RUN_SQL_TYPE,
} from '@/store/immudb/constants';

const WRITE_COMMANDS = [
	'INSERT',
	'UPDATE',
	'UPSERT',
	'CREATE',
	'SET',
	'DELETE',
	'BEGIN TRANSACTION',
	'COMMIT',
	'ROLLBACK',
	'ALTER',
];

const containsWord = (str, word) => {
	return str.match(new RegExp(`\\b${ word }\\b`)) != null;
};

const sqlParser = (data) => {
	if (data && typeof data === 'string') {
		return WRITE_COMMANDS.some(_ => containsWord(data.toUpperCase(), _))
			? RUN_SQL_TYPE.EXEC
			: RUN_SQL_TYPE.QUERY;
	}
	return RUN_SQL_TYPE.QUERY;
};

export default sqlParser;
