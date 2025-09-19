import db_client from "../../utils/client";

/**
 * Casts a vote on a forum post by a user. Supports upvote (1) and downvote (-1).
 * If the user has already voted with the same type, their vote is removed.
 * If the user has voted with a different type, their vote is updated.
 * If the user has not voted, a new vote is created.
 * Returns the voting result and the total vote sum for the post.
 *
 * @param vote_type - The type of vote: 1 for upvote, -1 for downvote.
 * @param post_id - The ID of the post to vote on.
 * @param user_id - The ID of the user casting the vote.
 * @returns An object containing:
 *   - voted: Whether the user has an active vote after the operation.
 *   - vote: The vote record if present, otherwise null.
 *   - vote_sum: The total sum of votes for the post.
 * @throws Error if the vote_type is invalid.
 */
export async function voteOnPost(
  vote_type: number,
  post_id: string,
  user_id: string
) {
  if (![1, -1].includes(vote_type)) {
    throw new Error("Invalid vote type");
  }

  const existingVote = await db_client.postVote.findUnique({
    where: {
      user_id_post_id: { user_id, post_id },
    },
  });

  let result;
  if (existingVote?.vote_type === vote_type) {
    await db_client.postVote.delete({
      where: {
        user_id_post_id: { user_id, post_id },
      },
    });
    result = null;
  } else if (existingVote) {
    result = await db_client.postVote.update({
      where: {
        user_id_post_id: { user_id, post_id },
      },
      data: { vote_type },
    });
  } else {
    result = await db_client.postVote.create({
      data: { user_id, post_id, vote_type },
    });
  }

  const totalVotes = await db_client.postVote.aggregate({
    where: { post_id },
    _sum: { vote_type: true },
  });

  return {
    voted: !!result,
    vote: result,
    vote_sum: totalVotes._sum.vote_type || 0,
  };
}

/**
 * Casts a vote (upvote or downvote) on a forum comment by a user.
 *
 * - If the user votes the same way twice, their vote is removed.
 * - If the user changes their vote, the vote is updated.
 * - If the user hasn't voted yet, a new vote is created.
 * - Returns the updated vote status and the total vote sum for the comment.
 *
 * @param vote_type - The type of vote: `1` for upvote, `-1` for downvote.
 * @param comment_id - The unique identifier of the comment being voted on.
 * @param user_id - The unique identifier of the user casting the vote.
 * @returns An object containing:
 *   - `voted`: Whether the user has an active vote after the operation.
 *   - `vote`: The vote record if present, otherwise `null`.
 *   - `vote_sum`: The sum of all votes for the comment.
 * @throws Error if `vote_type` is not `1` or `-1`.
 */
export async function voteOnComment(
  vote_type: number,
  comment_id: string,
  user_id: string
) {
  if (![1, -1].includes(vote_type)) {
    throw new Error("Invalid vote type");
  }

  const existingVote = await db_client.commentVote.findUnique({
    where: {
      user_id_comment_id: { user_id, comment_id },
    },
  });

  let result;
  if (existingVote?.vote_type === vote_type) {
    // User clicked same vote again, remove it
    await db_client.commentVote.delete({
      where: {
        user_id_comment_id: { user_id, comment_id },
      },
    });
    result = null;
  } else if (existingVote) {
    // Change vote
    result = await db_client.commentVote.update({
      where: {
        user_id_comment_id: { user_id, comment_id },
      },
      data: { vote_type },
    });
  } else {
    // New vote
    result = await db_client.commentVote.create({
      data: { user_id, comment_id, vote_type },
    });
  }

  const totalVotes = await db_client.commentVote.aggregate({
    where: { comment_id },
    _sum: { vote_type: true },
  });

  return {
    voted: !!result,
    vote: result,
    vote_sum: totalVotes._sum.vote_type || 0,
  };
}
