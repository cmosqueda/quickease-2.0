import db_client from "../../utils/client";
import _EXPO_PUSH_SERVICE from "../../utils/expo";

import { sendNotification } from "../../utils/notification";

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
    include: {
      user: {
        select: { first_name: true, last_name: true, push_token: true },
      },
    },
  });

  const post = await db_client.post.findUnique({
    where: { id: post_id },
    select: { user_id: true, user: true },
  });

  if (post) {
    const actorName = `${comment.user.first_name} ${comment.user.last_name}`;

    if (post.user.push_token) {
      await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
        {
          to: post.user.push_token,
          sound: "default",
          body: `${comment.comment_body}`,
          title: `${actorName} commented on your post.`,
        },
      ]);
    }

    await sendNotification({
      recipientId: post.user_id,
      actorId: user_id,
      type: "COMMENTED",
      message: `${actorName} commented on your post.`,
      resourceId: post_id,
      resourceType: "POST",
    });
  }

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
  // Fetch actor info
  const actor = await db_client.user.findUnique({
    where: { id: user_id },
    select: { first_name: true, last_name: true },
  });

  const parentComment = await db_client.comment.findUnique({
    where: { id: comment_id },
    select: { user_id: true },
  });

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

  if (parentComment && actor) {
    const actorName = `${actor.first_name} ${actor.last_name}`;
    await sendNotification({
      recipientId: parentComment.user_id,
      actorId: user_id,
      type: "REPLIED",
      message: `${actorName} replied to your comment.`,
      resourceId: comment_id,
      resourceType: "COMMENT",
    });
  }

  return { replied: true };
}
