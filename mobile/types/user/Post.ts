import { PostAttachment } from "./PostAttachment";
import { PostTag } from "./PostTag";
import { PostVote } from "./PostVote";
import { User } from "./User";

export interface Post {
  id: string;
  user_id: string;
  user: User;
  post_body: string;
  created_at: Date;
  updated_at: Date;
  is_public: boolean;

  tags: PostTag[];
  comments: Comment[];
  votes: PostVote[];
  attachments: PostAttachment[];
}
