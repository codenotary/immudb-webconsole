import { GithubApiService } from '@/services/index';

export const GithubService = {
	// AUTH
	getStars (config) {
		return GithubApiService.get('/search/repositories?q=repo%3Acodenotary%2Fimmudb', config);
	},
};
