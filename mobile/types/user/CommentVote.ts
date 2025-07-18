import { User } from "./User";

export interface CommentVote {
  user_id: string;
  comment_id: string;
  vote_type: number;

  user: User;
  comment: Comment;
}
