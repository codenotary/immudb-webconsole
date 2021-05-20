import {
	RUN_SQL_TYPE,
} from '@/store/immudb/constants';

const sqlParser = (data) => {
	return RUN_SQL_TYPE.QUERY;
};

export default sqlParser;
