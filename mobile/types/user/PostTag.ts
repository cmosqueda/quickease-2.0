import { Post } from "./Post";
import { Tag } from "./Tag";

export interface PostTag {
  tag_id: string;
  post_id: string;

  tag: Tag;
  post: Post;
}
