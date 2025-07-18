import { Post } from "./Post";
import { User } from "./User";

export interface PostVote {
  user_id: string;
  post_id: string;
  vote_type: number;

  user: User;
  post: Post;
}
