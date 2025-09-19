import db_client from "../../utils/client";
import _EXPO_PUSH_SERVICE from "../../utils/expo";

import { sendNotification } from "../../utils/notification";

/**
 * Retrieves all comments associated with a specific post.
 *
 * @param post_id - The unique identifier of the post for which to fetch comments.
 * @returns A promise that resolves to an array of comment objects related to the specified post.
 */
export async function getComments(post_id: string) {
  const comments = await db_client.comment.findMany({
    where: { post_id: post_id },
  });

  return comments;
}

/**
 * Adds a comment to a post and sends notifications to the post owner if applicable.
 *
 * - Creates a new comment associated with the specified post and user.
 * - If the post owner is not the commenting user, sends a push notification and an in-app notification to the post owner.
 *
 * @param body - The content of the comment.
 * @param post_id - The ID of the post to comment on.
 * @param user_id - The ID of the user making the comment.
 * @returns The created comment object, including selected user fields.
 */
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
    select: { user_id: true, user: true, title: true },
  });

  if (post) {
    if (post.user_id !== user_id) {
      const actorName = `${comment.user.first_name} ${comment.user.last_name}`;

      if (post.user.push_token) {
        await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
          {
            to: post.user.push_token,
            sound: "default",
            body: `${actorName} commented on your post.`,
            title: `About your post '${post.title}'`,
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
  }

  return comment;
}

/**
 * Updates the body of a comment with the specified ID.
 *
 * @param body - The new content for the comment.
 * @param comment_id - The unique identifier of the comment to update.
 * @returns A promise that resolves to the updated comment object.
 */
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

/**
 * Deletes a comment from the database by its unique identifier.
 *
 * @param comment_id - The unique identifier of the comment to be deleted.
 * @returns A promise that resolves to `true` if the deletion was successful.
 */
export async function deleteComment(comment_id: string) {
  await db_client.comment.delete({
    where: { id: comment_id },
  });

  return true;
}

/**
 * Replies to a specific comment on a forum post.
 *
 * This function creates a reply to the given comment, sends a push notification to the original comment's author
 * (if they are not the replier), and triggers an internal notification event.
 *
 * @param body - The content of the reply.
 * @param comment_id - The ID of the comment being replied to.
 * @param user_id - The ID of the user making the reply.
 * @param post_id - The ID of the post associated with the comment.
 * @returns An object indicating the reply was successful.
 */
export async function replyOnComment(
  body: string,
  comment_id: string,
  user_id: string,
  post_id: string
) {
  const actor = await db_client.user.findUnique({
    where: { id: user_id },
    select: { first_name: true, last_name: true },
  });

  const parentComment = await db_client.comment.findUnique({
    where: { id: comment_id },
    select: {
      user_id: true,
      post: {
        select: { title: true, user: { select: { push_token: true } } },
      },
    },
  });

  await db_client.comment.update({
    data: {
      replies: {
        create: {
          comment_body: body,
          user_id,
          post_id,
        },
      },
    },
    where: { id: comment_id },
  });

  if (parentComment && actor) {
    if (parentComment.user_id !== user_id) {
      const actorName = `${actor.first_name} ${actor.last_name}`;

      const parentUser = await db_client.user.findUnique({
        where: { id: parentComment.user_id },
        select: { push_token: true },
      });

      if (parentUser?.push_token) {
        await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
          {
            to: parentUser.push_token,
            sound: "default",
            body: `${actorName} replied to your comment.`,
            title: `On '${parentComment.post.title}'`,
          },
        ]);
      }

      await sendNotification({
        recipientId: parentComment.user_id,
        actorId: user_id,
        type: "REPLIED",
        message: `${actorName} replied to your comment.`,
        resourceId: comment_id,
        resourceType: "COMMENT",
      });
    }
  }

  return { replied: true };
}
