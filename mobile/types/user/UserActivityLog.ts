import { User } from "./User";

export interface UserActivityLog {
  id: string;
  recipient_user_id: string;
  recipient: User;
  actor_user_id: string;
  actor: User;
  activity_type_id: string;
  activity_type: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}
