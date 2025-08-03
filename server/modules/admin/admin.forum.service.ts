import db_client from "../../utils/client";

import { sendNotification } from "../../utils/notification";

export async function getReportedPosts() {
  const reportedPosts = await db_client.post.findMany({
    where: {
      reports: {
        some: {},
      },
    },
    include: {
      reports: {
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
      user: { select: { first_name: true, last_name: true } },
    },
  });

  return reportedPosts.sort((a, b) => b.reports.length - a.reports.length);
}

export async function getReportsByPosts(post_id: string) {
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
        },
      },
    },
  });

  return reports;
}

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
    },
  });

  await db_client.post.delete({
    where: {
      id: post_id,
    },
  });

  await sendNotification({
    actorId: admin_id,
    recipientId: user_id,
    message: `Your post named ${post.title} has been deleted due to many reports.`,
    type: "DELETED_POST_BY_REPORT",
  });

  return true;
}

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
    },
  });

  await db_client.comment.delete({
    where: {
      id: comment_id,
    },
  });

  await sendNotification({
    actorId: admin_id,
    recipientId: user_id,
    message: `Your comment on post named ${commentOnPost.post.title} has been deleted due to many reports.`,
    type: "DELETED_COMMENT_BY_REPORT",
  });

  return true;
}
