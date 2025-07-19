import db_client from "../../utils/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { buildCommentTree } from "../../utils/tree";
import { Prisma } from "../../prisma/client";

async function validateOwnership(
  tx: typeof db_client,
  user_id: string,
  resource_type: "NOTE" | "QUIZ" | "FLASHCARD",
  resource_id: string
): Promise<boolean> {
  switch (resource_type) {
    case "NOTE":
      return !!(await tx.note.findFirst({
        where: { id: resource_id, user_id },
        select: { id: true },
      }));
    case "FLASHCARD":
      return !!(await tx.flashcard.findFirst({
        where: { id: resource_id, user_id },
        select: { id: true },
      }));
    case "QUIZ":
      return !!(await tx.quiz.findFirst({
        where: { id: resource_id, user_id },
        select: { id: true },
      }));
    default:
      return false;
  }
}

export async function getUserPosts(user_id: string) {
  const posts = await db_client.post.findMany({
    where: { user_id: user_id },
  });

  return posts;
}

export async function getRecentPosts(cursor?: string | null, limit = 10) {
  const cutoffDate = dayjs.extend(utc).utc().subtract(7, "day").toDate();

  const posts = await db_client.post.findMany({
    where: {
      created_at: {
        gte: cutoffDate,
      },
      is_public: true,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      votes: {
        select: {
          vote_type: true,
          user_id: true,
        },
      },
      tags: { include: { tag: true } },
      comments: {
        where: { parent_comment: null },
        select: {
          parent_comment: true,
          comment_body: true,
          replies: true,
          votes: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      },
    },
    take: limit + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: {
            id: cursor,
          },
        }
      : {}),
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, -1) : posts;

  const postsWithVoteSum = items.map((post) => {
    const vote_sum = post.votes.reduce(
      (total, vote) => total + vote.vote_type,
      0
    );
    const user_vote = post.votes[0]?.vote_type ?? 0;

    return {
      ...post,
      vote_sum,
      user_vote,
    };
  });

  return {
    posts: postsWithVoteSum,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}

export async function getPost(post_id: string, user_id: string) {
  const post = await db_client.post.findFirst({
    where: { id: post_id },
    orderBy: { created_at: "desc" },
    include: {
      tags: { include: { tag: true } },
      attachments: {
        include: {
          flashcard: true,
          note: true,
          quiz: true,
        },
      },
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      votes: {
        where: { user_id },
        select: { vote_type: true },
      },
    },
  });

  if (!post) return null;

  const flatComments = await db_client.comment.findMany({
    where: { post_id },
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      comment_body: true,
      created_at: true,
      parent_comment_id: true,
      post_id: true,
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      votes: {
        select: {
          vote_type: true,
          user_id: true,
        },
      },
    },
  });

  const nestedComments = buildCommentTree(flatComments, user_id);

  const [upvotes, downvotes] = await Promise.all([
    db_client.postVote.count({
      where: { post_id, vote_type: 1 },
    }),
    db_client.postVote.count({
      where: { post_id, vote_type: -1 },
    }),
  ]);

  const vote_sum = upvotes - downvotes;
  const user_vote = post.votes[0]?.vote_type ?? 0;

  return {
    ...post,
    vote_sum,
    user_vote,
    vote_summary: { upvotes, downvotes },
    comments: nestedComments,
  };
}

export async function getComments(post_id: string) {
  const comments = await db_client.comment.findMany({
    where: { post_id: post_id },
  });

  return comments;
}

export async function createPost(
  body: string,
  title: string,
  user_id: string,
  attachments?: {
    resource_type: "NOTE" | "QUIZ" | "FLASHCARD";
    resource_id: string;
  }[],
  tags?: string[] // Accept tags here
) {
  return await db_client.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        title,
        post_body: body,
        user_id,
        is_public: true,
      },
    });

    if (attachments?.length) {
      const attachmentData = [];

      for (const { resource_type, resource_id } of attachments) {
        const isOwner = await validateOwnership(
          tx,
          user_id,
          resource_type,
          resource_id
        );

        if (!isOwner) {
          throw new Error(
            `Unauthorized or invalid ${resource_type} (ID: ${resource_id})`
          );
        }

        const base = {
          post_id: post.id,
          resource_type,
        };

        if (resource_type === "NOTE") {
          attachmentData.push({ ...base, note_id: resource_id });
        } else if (resource_type === "FLASHCARD") {
          attachmentData.push({ ...base, flashcard_id: resource_id });
        } else if (resource_type === "QUIZ") {
          attachmentData.push({ ...base, quiz_id: resource_id });
        }
      }

      await tx.postAttachment.createMany({ data: attachmentData });
    }

    if (tags?.length) {
      const tagRecords = [];

      for (const tagName of tags) {
        const tag = await tx.tag.upsert({
          where: { tag_name: tagName },
          update: {}, // no update needed
          create: { tag_name: tagName },
        });

        tagRecords.push({
          tag_id: tag.id,
          post_id: post.id,
        });
      }

      await tx.postTag.createMany({ data: tagRecords });
    }

    return post;
  });
}

export async function updatePost(
  body: string,
  title: string,
  post_id: string,
  user_id: string,
  attachments?: {
    resource_type: "NOTE" | "QUIZ" | "FLASHCARD";
    resource_id: string;
  }[]
) {
  return await db_client.$transaction(async (tx) => {
    const existingPost = await tx.post.findUnique({
      where: { id: post_id },
      select: { user_id: true },
    });

    if (!existingPost || existingPost.user_id !== user_id) {
      throw new Error("Unauthorized or non-existent post.");
    }

    await tx.postAttachment.deleteMany({ where: { post_id } });

    if (attachments?.length) {
      const attachmentData = [];

      for (const { resource_type, resource_id } of attachments) {
        const isOwner = await validateOwnership(
          tx,
          user_id,
          resource_type,
          resource_id
        );

        if (!isOwner) {
          throw new Error(
            `Unauthorized or invalid ${resource_type} (ID: ${resource_id})`
          );
        }

        const base = {
          post_id,
          resource_type,
        };

        if (resource_type === "NOTE") {
          attachmentData.push({ ...base, note_id: resource_id });
        } else if (resource_type === "FLASHCARD") {
          attachmentData.push({ ...base, flashcard_id: resource_id });
        } else if (resource_type === "QUIZ") {
          attachmentData.push({ ...base, quiz_id: resource_id });
        }
      }

      await tx.postAttachment.createMany({ data: attachmentData });
    }

    const updatedPost = await tx.post.update({
      where: { id: post_id },
      data: {
        title,
        post_body: body,
        updated_at: dayjs().toISOString(),
      },
    });

    return updatedPost;
  });
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

export async function addTagOnPost(post_id: string, tag_ids: string[]) {
  const postTags = await Promise.all(
    tag_ids.map((tag_id) =>
      db_client.postTag.upsert({
        where: { tag_id_post_id: { tag_id, post_id } },
        update: {},
        create: { tag_id, post_id },
      })
    )
  );

  return postTags;
}

export async function deletePost(post_id: string) {
  await db_client.post.delete({
    where: { id: post_id },
  });

  return { deleted: true };
}

export async function togglePostVisibility(
  visibility: boolean,
  post_id: string
) {
  await db_client.post.update({
    data: {
      is_public: visibility,
    },
    where: {
      id: post_id,
    },
  });

  return true;
}

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

export async function searchPost(
  query: string,
  page = 1,
  limit = 10,
  sort: "newest" | "top" | "comments" = "newest"
) {
  const skip = (page - 1) * limit;

  // Base filter
  const baseWhere: Prisma.PostWhereInput = {
    OR: [
      {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        tags: {
          some: {
            tag: {
              tag_name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      },
    ],
    is_public: true,
  };

  const posts = await db_client.post.findMany({
    where: baseWhere,
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: { tag_name: true },
          },
        },
      },
      comments: true,
      votes: {
        where: {
          vote_type: 1,
        },
      },
    },
    orderBy:
      sort === "comments"
        ? {
            comments: {
              _count: "desc",
            },
          }
        : sort === "top"
        ? {
            votes: {
              _count: "desc",
            },
          }
        : {
            created_at: "desc",
          },
    skip,
    take: limit,
  });

  const total = await db_client.post.count({
    where: baseWhere,
  });

  return {
    posts,
    total,
  };
}
