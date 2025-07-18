import { PostTag } from "./PostTag";

export interface Tag {
  id: string;
  tag_name: string;
  created_at: Date;

  posts: PostTag[];
}
