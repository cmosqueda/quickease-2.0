import db_client from "../../utils/client";

export async function getComments(post_id: string) {
  const comments = await db_client.comment.findMany({
    where: { post_id: post_id },
  });

  return comments;
}

export async function commentOnPost(
  body: string,
  post_id: string,
  user_id: string
) {
  const comment = await db_client.comment.create({
    data: {
      comment_body: body,
      post_id,
      user_id,
    },
  });

  return comment;
}

export async function updateComment(body: string, comment_id: string) {
  const comment = await db_client.comment.update({
    data: {
      comment_body: body,
    },
    where: {
      id: comment_id,
    },
  });

  return comment;
}

export async function deleteComment(comment_id: string) {
  await db_client.comment.delete({
    where: { id: comment_id },
  });

  return true;
}

export async function replyOnComment(
  body: string,
  comment_id: string,
  user_id: string,
  post_id: string
) {
  await db_client.comment.update({
    data: {
      replies: {
        create: {
          comment_body: body,
          user_id: user_id,
          post_id: post_id,
        },
      },
    },
    where: {
      id: comment_id,
    },
  });

  return { replied: true };
}
