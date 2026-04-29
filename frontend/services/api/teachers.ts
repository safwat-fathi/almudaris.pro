import { HTTPService } from "../base/HTTPService";

export interface Student {
	id: number;
	name: string;
	education_stage?: string;
	education_year?: number;
	grade_label?: string;
}

/**
 * Server-side API wrapper for Teacher-specific operations.
 * Must ONLY be called from Server Components or Server Actions.
 */
class TeachersService extends HTTPService {
	constructor() {
		super();
	}

	/**
	 * Fetches all students enrolled with the authenticated teacher.
	 */
	async fetchStudents(params?: {
		education_stage?: string;
		education_year?: number;
	}): Promise<{ data: Student[] }> {
		const query = new URLSearchParams();
		if (params?.education_stage) {
			query.set("education_stage", params.education_stage);
		}
		if (params?.education_year !== undefined) {
			query.set("education_year", String(params.education_year));
		}
		const queryString = query.toString() ? `?${query.toString()}` : "";
		return this.get<{ data: Student[] }>(`/teachers/students${queryString}`);
	}

	/**
	 * Fetches the invite code for the authenticated teacher.
	 */
	async fetchInviteCode(): Promise<{ inviteCode: string }> {
		return this.get<{ inviteCode: string }>("/teachers/invite-code");
	}
}

export const teachersService = new TeachersService();
