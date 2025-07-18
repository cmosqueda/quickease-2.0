import { PostAttachment } from "./PostAttachment";
import { User } from "./User";

export interface Flashcard {
  id: string;
  user_id: string;
  user: User;
  title: string;
  description?: string | null;
  flashcards: { front: string; back: string }[];
  is_public?: boolean | null;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean | null;

  attachments: PostAttachment[];
}
