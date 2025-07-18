import { PostAttachment } from "./PostAttachment";
import { QuizAttempt } from "./QuizAttempt";
import { User } from "./User";

export interface Quiz {
  id: string;
  user_id: string;
  user: User;
  quiz_content: any;
  title: string;
  description?: string | null;
  is_public?: boolean | null;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean | null;

  attachments: PostAttachment[];
  attempts: QuizAttempt[];
}
