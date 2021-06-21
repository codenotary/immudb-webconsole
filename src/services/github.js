import { GithubApiService } from '@/services/index';

export const GithubService = {
	// STARS
	getStars (config) {
		return GithubApiService.get('/repos/codenotary/immudb', config);
	},
};
