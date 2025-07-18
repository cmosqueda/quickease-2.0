import { User } from "./User";

export interface Note {
  id: string;
  user_id: string;
  user: User;
  title: string;
  notes_content: string;
  is_public?: boolean | null;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean | null;
}
