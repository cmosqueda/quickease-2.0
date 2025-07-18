import { Quiz } from "./Quiz";
import { User } from "./User";

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  quiz: Quiz;
  user_id: string;
  user: User;
  started_at: Date;
  completed_at?: Date | null;
  time_taken?: string | null;
  answer_data: any;
  is_public: boolean;
}
