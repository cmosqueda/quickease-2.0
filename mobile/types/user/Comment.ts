import { CommentVote } from "./CommentVote";
import { Post } from "./Post";
import { User } from "./User";

export interface Comment {
  id: string;
  parent_comment_id?: string | null;
  parent_comment?: Comment | null;
  replies: Comment[];

  post_id: string;
  post: Post;
  user_id: string;
  user: User;
  comment_body: string;
  created_at: Date;
  updated_at: Date;

  votes: CommentVote[];
}
