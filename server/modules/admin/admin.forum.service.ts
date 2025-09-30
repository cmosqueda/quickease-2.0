import db_client from "../../utils/client";
import _EXPO_PUSH_SERVICE from "../../utils/expo";

import { sendNotification } from "../../utils/notification";

/**
 * Retrieves a paginated list of posts that have been reported.
 *
 * Each post includes up to 5 reports, with details about the users who reported them,
 * as well as basic information about the post's author.
 * The posts are ordered by the number of reports in descending order.
 *
 * @param page - The page number for pagination (defaults to 1).
 * @returns A promise that resolves to an array of reported posts with their associated reports and user information.
 */
export async function getReportedPosts(page = 1) {
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const posts = await db_client.post.findMany({
    where: {
      reports: {
        some: {},
      },
    },
    include: {
      reports: {
        take: 5,
        include: {
          reported_by: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      reports: {
        _count: "desc",
      },
    },
    take: pageSize,
    skip: offset,
  });

  return posts;
}

/**
 * Retrieves a paginated list of comments that have been reported.
 *
 * Each comment includes up to 5 reports, with details about the reporting users,
 * the comment's author, and the associated post. Results are ordered by the number
 * of reports in descending order.
 *
 * @param page - The page number for pagination (defaults to 1).
 * @returns A promise that resolves to an array of reported comments with related data.
 */
export async function getReportedComments(page = 1) {
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const comments = await db_client.comment.findMany({
    where: {
      reports: {
        some: {},
      },
    },
    include: {
      reports: {
        take: 5,
        include: {
          reported_by: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      reports: {
        _count: "desc",
      },
    },
    take: pageSize,
    skip: offset,
  });

  return comments;
}

/**
 * Searches for reported forum posts with pagination and optional title query.
 *
 * Retrieves posts that have at least one report, optionally filtering by a case-insensitive title query.
 * Returns a paginated list of posts, including up to 5 reports per post and basic user information.
 *
 * @param page - The page number for pagination (default is 1).
 * @param query - Optional search string to filter posts by title (default is empty string).
 * @returns An object containing:
 *   - posts: Array of reported posts with included reports and user info.
 *   - total: Total number of matching reported posts.
 *   - page: Current page number.
 *   - totalPages: Total number of pages based on the result count.
 */
export async function searchReportedPosts(page = 1, query = "") {
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    db_client.post.findMany({
      where: {
        reports: {
          some: {},
        },
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        reports: {
          take: 5,
          include: {
            reported_by: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        reports: {
          _count: "desc",
        },
      },
      skip,
      take: pageSize,
    }),
    db_client.post.count({
      where: {
        reports: {
          some: {},
        },
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Retrieves all reports associated with a specific post, along with the post details.
 *
 * @param post_id - The unique identifier of the post for which reports are to be fetched.
 * @returns An object containing:
 *   - `reports`: An array of report objects, each including information about the user who reported the post.
 *   - `post`: The details of the post, including its author information.
 *
 * @throws Will propagate any errors thrown by the database client.
 */
export async function getReportsByPost(post_id: string) {
  const reports = await db_client.report.findMany({
    where: {
      reported_post_id: post_id,
    },
    include: {
      reported_by: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  const post = await db_client.post.findFirst({
    where: {
      id: post_id,
    },
    select: {
      id: true,
      title: true,
      post_body: true,
      created_at: true,
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    },
  });

  return { reports, post };
}

/**
 * Retrieves all reports associated with a specific comment, along with detailed information
 * about the comment itself, its author, and the related post.
 *
 * @param comment_id - The unique identifier of the comment for which reports are to be fetched.
 * @returns An object containing:
 * - `reports`: An array of report objects, each including information about the user who reported the comment.
 * - `comment`: The comment object, including its body, creation date, author details, and related post information.
 *
 * @throws Will propagate any errors thrown by the database client.
 */
export async function getReportsByComment(comment_id: string) {
  const reports = await db_client.report.findMany({
    where: {
      reported_comment_id: comment_id,
    },
    include: {
      reported_by: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  const comment = await db_client.comment.findFirst({
    where: {
      id: comment_id,
    },
    select: {
      id: true,
      comment_body: true,
      created_at: true,
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return { reports, comment };
}

/**
 * Deletes a forum post by its ID, notifies the post owner via push notification if available,
 * and sends an internal notification about the deletion.
 *
 * @param post_id - The unique identifier of the post to be deleted.
 * @param admin_id - The unique identifier of the admin performing the deletion.
 * @param user_id - The unique identifier of the user who owns the post.
 * @returns A promise that resolves to `true` when the operation is complete.
 *
 * @throws Will throw an error if the post cannot be found or deleted.
 */
export async function deletePost(
  post_id: string,
  admin_id: string,
  user_id: string
) {
  const post = await db_client.post.findFirst({
    where: {
      id: post_id,
    },
    select: {
      title: true,
      user: {
        select: {
          push_token: true,
        },
      },
    },
  });

  await db_client.post.delete({
    where: {
      id: post_id,
    },
  });

  if (post.user.push_token) {
    await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
      {
        to: post.user.push_token,
        sound: "default",
        title: "About your post",
        body: `Your post named ${post.title} has been deleted due to many reports.`,
      },
    ]);
  }

  await sendNotification({
    actorId: admin_id,
    recipientId: user_id,
    message: `Your post named ${post.title} has been deleted due to many reports.`,
    type: "DELETED_POST_BY_REPORT",
  });

  return true;
}

/**
 * Deletes a comment from the database, notifies the user via push notification if available,
 * and sends an internal notification about the deletion.
 *
 * @param comment_id - The unique identifier of the comment to be deleted.
 * @param admin_id - The unique identifier of the admin performing the deletion.
 * @param user_id - The unique identifier of the user who made the comment.
 * @returns A promise that resolves to `true` when the operation is complete.
 *
 * @throws Will throw an error if the comment cannot be found or deleted.
 */
export async function deleteComment(
  comment_id: string,
  admin_id: string,
  user_id: string
) {
  const commentOnPost = await db_client.comment.findFirst({
    where: {
      id: comment_id,
    },
    include: {
      post: {
        select: { title: true },
      },
      user: { select: { push_token: true } },
    },
  });

  await db_client.comment.delete({
    where: {
      id: comment_id,
    },
  });

  if (commentOnPost.user.push_token) {
    await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
      {
        to: commentOnPost.user.push_token,
        sound: "default",
        title: "About your comment",
        body: `Your comment on post named ${commentOnPost.post.title} has been deleted due to many reports.`,
      },
    ]);
  }

  await sendNotification({
    actorId: admin_id,
    recipientId: user_id,
    message: `Your comment on post named ${commentOnPost.post.title} has been deleted due to many reports.`,
    type: "DELETED_COMMENT_BY_REPORT",
  });

  return true;
}

/**
 * Resolves a post by marking it as deleted due to multiple reports.
 *
 * This function performs the following actions:
 * 1. Retrieves the post and its user's push token.
 * 2. Updates the post's status to "IS_DELETED".
 * 3. Sends a push notification to the post owner if a push token is available.
 * 4. Sends an internal notification to the user about the deletion.
 *
 * @param post_id - The unique identifier of the post to resolve.
 * @param admin_id - The unique identifier of the admin performing the action.
 * @param user_id - The unique identifier of the user who owns the post.
 * @returns A promise that resolves to `true` when the operation is complete.
 */
export async function resolvePost(
  post_id: string,
  admin_id: string,
  user_id: string
) {
  const post = await db_client.post.findFirst({
    where: {
      id: post_id,
    },
    select: {
      title: true,
      user: { select: { push_token: true } },
    },
  });

  await db_client.post.update({
    data: {
      is_resolved: "IS_DELETED",
    },
    where: {
      id: post_id,
    },
  });

  if (post.user.push_token) {
    await _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
      {
        to: post.user.push_token,
        sound: "default",
        title: "About your post",
        body: `Your post named ${post.title} has been deleted due to many reports.`,
      },
    ]);
  }

  await sendNotification({
    actorId: admin_id,
    recipientId: user_id,
    message: `Your post named ${post.title} has been deleted due to many reports.`,
    type: "DELETED_POST_BY_REPORT",
  });

  return true;
}
