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
	education_stage?: string;
	education_year?: number;
	grade_label?: string;
}

class HomeworkService extends HTTPService {
	constructor() {
		super();
	}


	async fetchHomework(params?: {
		education_stage?: string;
		education_year?: number;
	}) {
		const query = new URLSearchParams();
		if (params?.education_stage) query.set("education_stage", params.education_stage);
		if (params?.education_year !== undefined) query.set("education_year", String(params.education_year));
		const queryString = query.toString() ? `?${query.toString()}` : "";
		return this.get<{ data: Homework[] }>(`/homework${queryString}`);
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
