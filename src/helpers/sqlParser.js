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
];

const sqlParser = (data) => {
	if (data && typeof data === 'string') {
		return WRITE_COMMANDS.some(_ => data.toUpperCase().includes(_))
			? RUN_SQL_TYPE.EXEC
			: RUN_SQL_TYPE.QUERY;
	}
	return RUN_SQL_TYPE.QUERY;
};

export default sqlParser;
