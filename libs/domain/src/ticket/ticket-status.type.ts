export interface ITicketStatus {
  id: number;
  created_date_time: string;
  last_modified: string;
  created_by: string;
  modified_by: string;
  priority: number;
  status: string;
  name: string;
  color: string;
  order: number;
  is_close: boolean | null;
  is_archived: boolean | null;
  is_resolved: boolean | null;
}
