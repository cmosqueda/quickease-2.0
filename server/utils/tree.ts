import { FlatComment, NestedComment } from "./types";

/**
 * Builds a nested comment tree from a flat list of comments.
 *
 * Each comment is mapped to its parent, forming a hierarchical structure.
 * The function also calculates the vote sum and the current user's vote for each comment.
 *
 * @param comments - Array of flat comments to be nested.
 * @param user_id - The ID of the user to determine their vote on each comment.
 * @returns An array of nested comments representing the root-level comments and their replies.
 */
export function buildCommentTree(
  comments: FlatComment[],
  user_id: string
): NestedComment[] {
  const commentMap = new Map<string, NestedComment>();

  for (const comment of comments) {
    commentMap.set(comment.id, {
      ...comment,
      replies: [],
      vote_sum: comment.votes.reduce((sum, vote) => sum + vote.vote_type, 0),
      user_vote:
        comment.votes.find((v) => v.user_id === user_id)?.vote_type ?? 0,
    });
  }

  const tree: NestedComment[] = [];

  for (const comment of commentMap.values()) {
    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      tree.push(comment);
    }
  }

  return tree;
}
