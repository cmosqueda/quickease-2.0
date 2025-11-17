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
        select: { first_name: true, last_name: true },
      },
      post: {
        select: {
          id: true,
          title: true,
          user: {
            select: { id: true, push_token: true },
          },
        },
      },
    },
  });

  try {
    const { post, user } = comment;
    const postOwner = post.user;
    const actorName = `${user.first_name} ${user.last_name}`;

    if (postOwner.id !== user_id) {
      if (postOwner.push_token) {
        await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
          {
            to: postOwner.push_token,
            sound: "default",
            body: `${actorName} commented on your post.`,
            title: `About your post '${post.title}'`,
          },
        ]);
      }

      await sendNotification({
        recipientId: postOwner.id,
        actorId: user_id,
        type: "COMMENTED",
        message: `${actorName} commented on your post.`,
        resourceId: post_id,
        resourceType: "POST",
      });
    }
  } catch (notificationError) {
    console.error("Failed to send notification:", notificationError);
  }

  // 3. Return the created comment
  return comment;
}
/**
 * Updates the body of a comment with the specified ID.
 *
 * @param body - The new content for the comment.
 * @param comment_id - The unique identifier of the comment to update.
 * @returns A promise that resolves to the updated comment object.
 */
export async function updateComment(
  body: string,
  comment_id: string,
  user_id: string
) {
  const result = await db_client.comment.updateMany({
    data: {
      comment_body: body,
    },
    where: {
      id: comment_id,
      user_id: user_id,
    },
  });

  if (result.count === 0) {
    throw new Error("Comment not found or user not authorized.");
  }

  return db_client.comment.findUnique({ where: { id: comment_id } });
}

/**
 * Deletes a comment from the database by its unique identifier.
 *
 * @param comment_id - The unique identifier of the comment to be deleted.
 * @returns A promise that resolves to `true` if the deletion was successful.
 */
export async function deleteComment(comment_id: string, user_id: string) {
  const result = await db_client.comment.deleteMany({
    where: {
      id: comment_id,
      user_id: user_id,
    },
  });

  if (result.count === 0) {
    throw new Error("Comment not found or user not authorized.");
  }

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
  parent_comment_id: string,
  user_id: string,
  post_id: string
) {
  const newReply = await db_client.comment.create({
    data: {
      comment_body: body,
      user_id,
      post_id,
      parent_comment_id: parent_comment_id,
    },
    include: {
      user: {
        select: { first_name: true, last_name: true },
      },
      parent_comment: {
        select: {
          user: {
            select: { id: true, push_token: true },
          },
          post: {
            select: { title: true },
          },
        },
      },
    },
  });

  try {
    const { parent_comment, user } = newReply;
    const recipient = parent_comment?.user;
    const actorName = `${user.first_name} ${user.last_name}`;

    if (recipient && recipient.id !== user_id) {
      if (recipient.push_token) {
        await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
          {
            to: recipient.push_token,
            sound: "default",
            body: `${actorName} replied to your comment.`,
            title: `On '${parent_comment?.post.title}'`,
          },
        ]);
      }

      await sendNotification({
        recipientId: recipient.id,
        actorId: user_id,
        type: "REPLIED",
        message: `${actorName} replied to your comment.`,
        resourceId: post_id,
        resourceType: "COMMENT",
      });
    }
  } catch (notificationError) {
    console.error("Failed to send reply notification:", notificationError);
  }

  return newReply;
}
