import { CommentVote } from "./CommentVote";
import { Flashcard } from "./Flashcard";
import { Note } from "./Note";
import { Post } from "./Post";
import { PostVote } from "./PostVote";
import { Quiz } from "./Quiz";
import { QuizAttempt } from "./QuizAttempt";
import { UserActivityLog } from "./UserActivityLog";

export interface User {
  id: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string | null;
  phone_number?: string | null;
  badges?: any | null;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;

  flashcards: Flashcard[];
  notes: Note[];
  quizzes: Quiz[];
  posts: Post[];
  comments: Comment[];
  postVotes: PostVote[];
  commentVotes: CommentVote[];
  quizAttempts: QuizAttempt[];
  activityLogsReceived: UserActivityLog[];
  activityLogsSent: UserActivityLog[];
  forumReports: Report[];
}
