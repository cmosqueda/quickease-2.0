import db_client from "../../utils/client";

import { sendNotification } from "../../utils/notification";

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
        },
      },
    },
  });

  return { reports, post };
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

  await sendNotification({
    actorId: admin_id,
    recipientId: user_id,
    message: `Your post named ${post.title} has been deleted due to many reports.`,
    type: "DELETED_POST_BY_REPORT",
  });

  return true;
}
