import db_client from "../../utils/client";

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
