import { Flashcard } from "./Flashcard";
import { Post } from "./Post";
import { Quiz } from "./Quiz";

export interface PostAttachment {
  id: string;
  post_id: string;
  post: Post;
  resource_type: string;
  flashcard_id?: string | null;
  flashcard?: Flashcard | null;
  quizzes_id?: string | null;
  quiz?: Quiz | null;
  created_at: Date;
  updated_at: Date;
}
