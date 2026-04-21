import { HTTPService } from "../base/HTTPService";

export interface Student {
	id: number;
	name: string;
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
	async fetchStudents(): Promise<{ data: Student[] }> {
		return this.get<{ data: Student[] }>("/teachers/students");
	}

	/**
	 * Fetches the invite code for the authenticated teacher.
	 */
	async fetchInviteCode(): Promise<{ inviteCode: string }> {
		return this.get<{ inviteCode: string }>("/teachers/invite-code");
	}
}

export const teachersService = new TeachersService();
