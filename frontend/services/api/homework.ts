import { HTTPService } from "../base/HTTPService";

export interface Homework {
	id: number;
	group_id: number;
	title: string;
	description?: string;
	due_date?: string;
	is_open: boolean;
	created_at: string;
	updated_at: string;
}

class HomeworkService extends HTTPService {
	constructor() {
		super();
	}

	async fetchHomeworkByGroupId(groupId: number) {
		return this.get<{ data: Homework[] }>(`/homework/group/${groupId}`);
	}

	async getSubmissionsByHomeworkId(homeworkId: string) {
		return this.get<{ data: Homework[] }>(
			`/homework/${homeworkId}/submissions`,
		);
	}
}

export const homeworkService = new HomeworkService();
