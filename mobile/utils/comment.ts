import { Comment } from "@/types/user/types";

export function findCommentById(
  comments: Comment[],
  id: string
): Comment | undefined {
  for (const c of comments) {
    if (c.id === id) return c;
    if (c.replies && c.replies.length > 0) {
      const found = findCommentById(c.replies, id);
      if (found) return found;
    }
  }
  return undefined;
}
