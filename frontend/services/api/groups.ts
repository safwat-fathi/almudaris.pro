import { HTTPService } from "../base/HTTPService";

export type GroupStatus = "Scheduled" | "Completed" | "Cancelled";
export type LocationType = "Online" | "Physical";

export interface CreateGroupData {
	date: string;
	start_time: string;
	duration_minutes: number;
	student_ids: number[];
	location_type: LocationType;
	location_link?: string;
	location_place?: string;
	title?: string;
	is_recurring?: boolean;
	recurrence_pattern?: string;
	recurrence_count?: number;
}

export interface UpdateGroupData extends Partial<CreateGroupData> {
	edit_scope?: "THIS" | "THIS_AND_FUTURE" | "ALL";
}

export interface GroupStudent {
	group_id: number;
	student_id: number;
	student_name: string;
	attendance_status: "Present" | "Absent" | "Not set";
	note?: string;
	note_updated_at?: string;
}

export interface Group {
	id: number;
	teacher_id: number;
	title?: string;
	date: string;
	start_time: string;
	end_time: string;
	duration_minutes: number;
	status: GroupStatus;
	location_type: LocationType;
	location_link?: string;
	location_place?: string;
	recurring_series_id?: number;
	notes?: string;
	created_by_id: number;
	students: GroupStudent[];
	created_at: string;
	updated_at: string;
}

export interface PaginatedGroups {
	items: Group[];
	total: number;
	page: number;
	limit: number;
	last_page: number;
}

export interface CreateGroupResponse {
	data: Group[];
	warnings: string[];
}

export interface UpdateGroupResponse {
	data: Group;
	warnings: string[];
}

export interface FetchGroupsParams {
	from?: string;
	to?: string;
	status?: GroupStatus;
	student_id?: number;
	page?: number;
	limit?: number;
}

export interface UpdateAttendanceData {
	notes?: string;
	students: {
		id: number;
		attendance_status: "Present" | "Absent" | "Not set";
		note?: string;
	}[];
}

export interface UpdateStatusData {
	status: "Completed";
}

/**
 * Server-side API wrapper for Groups.
 * Must ONLY be called from Server Components or Server Actions.
 */
class GroupsService extends HTTPService {
	constructor() {
		super();
	}
	async fetchGroups(
		params: FetchGroupsParams = {},
	): Promise<{ data: PaginatedGroups }> {
		const query = new URLSearchParams();
		if (params.from) query.append("from", params.from);
		if (params.to) query.append("to", params.to);
		if (params.status) query.append("status", params.status);
		if (params.student_id)
			query.append("student_id", params.student_id.toString());
		if (params.page !== undefined) query.append("page", params.page.toString());
		if (params.limit !== undefined)
			query.append("limit", params.limit.toString());

		const queryString = query.toString() ? `?${query.toString()}` : "";
		return this.get<{ data: PaginatedGroups }>(`/groups${queryString}`);
	}

	async fetchGroup(id: number): Promise<{ data: Group }> {
		return this.get<{ data: Group }>(`/groups/${id}`);
	}

	async createGroup(data: CreateGroupData): Promise<CreateGroupResponse> {
		return this.post<CreateGroupResponse>("/groups", data);
	}

	async updateGroup(
		id: number,
		data: UpdateGroupData,
	): Promise<UpdateGroupResponse> {
		return this.patch<UpdateGroupResponse>(`/groups/${id}`, data);
	}

	async updateAttendance(
		id: number,
		data: UpdateAttendanceData,
	): Promise<Group> {
		return this.patch<Group>(`/groups/${id}/attendance`, data);
	}

	async updateStatus(id: number, data: UpdateStatusData): Promise<Group> {
		return this.patch<Group>(`/groups/${id}/status`, data);
	}

	async cancelGroup(id: number): Promise<void> {
		return this.delete<void>(`/groups/${id}`);
	}
}

export const groupsService = new GroupsService();