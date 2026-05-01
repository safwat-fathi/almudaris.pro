import { groupsService, FetchGroupsParams } from "../api/groups";

class GroupsBffService {
	async fetchGroups(params: FetchGroupsParams = {}) {
		return groupsService.fetchGroups(params);
	}
}

export const groupsBffService = new GroupsBffService();
