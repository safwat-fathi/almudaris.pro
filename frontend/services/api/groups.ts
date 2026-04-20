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
  groups: Group[];
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

/**
 * Server-side API wrapper for Groups.
 * Must ONLY be called from Server Components or Server Actions.
 */
export class GroupsApi {
  /**
   * Note: The backend endpoint might be paginated or array depending on implementation.
   * Assuming it returns PaginatedGroups based on recent updates.
   */
  static async fetchGroups(params: FetchGroupsParams = {}): Promise<PaginatedGroups> {
    const query = new URLSearchParams();
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);
    if (params.status) query.append("status", params.status);
    if (params.student_id) query.append("student_id", params.student_id.toString());
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.limit !== undefined) query.append("limit", params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return HTTPService.get<PaginatedGroups>(`/groups${queryString}`);
  }

  static async fetchGroup(id: number): Promise<Group> {
    return HTTPService.get<Group>(`/groups/${id}`);
  }

  static async createGroup(data: CreateGroupData): Promise<CreateGroupResponse> {
    return HTTPService.post<CreateGroupResponse>("/groups", data);
  }
}
