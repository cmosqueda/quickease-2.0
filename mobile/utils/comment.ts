import { Comment } from "@/types/user/types";

/**
 * Recursively searches for a comment by its ID within a nested array of comments.
 *
 * @param comments - The array of comments to search through.
 * @param id - The unique identifier of the comment to find.
 * @returns The comment with the matching ID, or `undefined` if not found.
 */
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
