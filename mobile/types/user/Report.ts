import { User } from "./User";

export interface Report {
  id: string;
  reported_by_id: string;
  reported_by: User;
  description: string;
  reported_target_type: string;
  reported_target_id: string;
  reported_at: Date;
}
