import path from 'path';
import fs from 'fs';

export const { NODE_ENV, NGROK, HOST, PORT, TARGET, PUBLIC_DEMO } = process.env;
export const IS_PROD = NODE_ENV === 'production';
export const IS_STAGING = NODE_ENV === 'staging';
export const IS_LOCAL = NODE_ENV === 'development' || NODE_ENV === 'local';
export const IS_TEST = NODE_ENV === 'test';
export const IS_SSL = PORT === '443' || PORT === '8443';
export const PROTOCOL = `http${ IS_SSL ? 's' : '' }`;
export const EXPERIMENTAL = false && !IS_PROD; ;
export const API_BASE = '/api/';
export const METRICS_BASE = '/metrics-api';
export const IS_PUBLIC_DEMO = PUBLIC_DEMO !== '0' || PUBLIC_DEMO === 0;

export const CLIENT_URL = (NGROK || HOST) && PORT
	? `${ PROTOCOL }://${ NGROK || HOST }:${ PORT }`
	: `https://demo${ IS_STAGING ? '-staging' : '' }.immudb.io`;

export const SERVER_URL = PROTOCOL && HOST && PORT
	? `${ PROTOCOL }://${ HOST }:${ PORT }${ TARGET ? `/${ TARGET }` : '' }${ API_BASE }`
	: API_BASE;

export const METRICS_URL = PROTOCOL && HOST && PORT
	? `${ PROTOCOL }://${ HOST }:${ PORT }${ TARGET ? `/${ TARGET }` : '' }${ METRICS_BASE }`
	: API_BASE;

let _CERTS = {
	key: undefined,
	cert: undefined,
};

try {
	if (IS_LOCAL && IS_SSL) {
		_CERTS = {
			key: fs.readFileSync(path.resolve(__dirname, './../../localhost.key')),
			cert: fs.readFileSync(path.resolve(__dirname, './../../localhost.crt')),
		};
	}
}
catch {
	console.warn('No certs found to run UI in https. Visit "https://letsencrypt.org/docs/certificates-for-localhost/" to discover how to create them (NB: they should be placed within the /client dir)');
}

export const CERTS = _CERTS;

console.log('==============================');
if (IS_PROD) {
	console.log('Env is: PRODUCTION');
}
else if (IS_STAGING) {
	console.log('Env is: STAGING');
}
else if (IS_TEST) {
	console.log('Env is: TEST');
}
else {
	console.log('Env is: LOCAL');
}
console.log('Client url is: ', CLIENT_URL);
console.log('Server url is: ', SERVER_URL);
console.log('Metrics url is: ', METRICS_URL);
console.log('==============================');
console.log(`Running ${ IS_PUBLIC_DEMO
	? 'public demo'
	: 'local embedded' } client`);
if (IS_PUBLIC_DEMO) {
	console.log('that means the appliance should be running using docker (k8s compatibility need testing)');
}
console.log('=======================================');