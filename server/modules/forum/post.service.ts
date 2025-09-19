import db_client from "../../utils/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import _AI from "../../utils/ai";

import { buildCommentTree } from "../../utils/tree";
import { Prisma } from "@prisma/client";

/**
 * Validates whether a user owns a specific resource (NOTE, QUIZ, or FLASHCARD).
 *
 * @param tx - The Prisma transaction client used to query the database.
 * @param user_id - The ID of the user whose ownership is being validated.
 * @param resource_type - The type of resource to check ownership for ("NOTE", "QUIZ", or "FLASHCARD").
 * @param resource_id - The ID of the resource to check.
 * @returns A promise that resolves to `true` if the user owns the resource, otherwise `false`.
 */
async function validateOwnership(
  tx: Prisma.TransactionClient,
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

/**
 * Retrieves all posts created by a specific user.
 *
 * @param user_id - The unique identifier of the user whose posts are to be fetched.
 * @returns A promise that resolves to an array of posts belonging to the specified user.
 */
export async function getUserPosts(user_id: string) {
  const posts = await db_client.post.findMany({
    where: { user_id: user_id },
  });

  return posts;
}

/**
 * Retrieves a paginated list of recent public forum posts from the last 7 days.
 *
 * Each post includes user information, votes, tags, and top-level comments with their replies and vote counts.
 * Supports cursor-based pagination.
 *
 * @param cursor - Optional. The ID of the post to start fetching from (for pagination).
 * @param limit - Optional. The maximum number of posts to return (default is 10).
 * @returns An object containing:
 *   - posts: Array of posts with aggregated vote sums and the current user's vote.
 *   - nextCursor: The ID to use as the cursor for the next page, or null if there are no more posts.
 */
export async function getRecentPosts(cursor?: string | null, limit = 10) {
  const cutoffDate = dayjs.extend(utc).utc().subtract(7, "day").toDate();

  const posts = await db_client.post.findMany({
    where: {
      created_at: {
        gte: cutoffDate,
      },
      is_public: true,
      is_resolved: null,
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
          avatar: true,
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

/**
 * Retrieves a forum post by its ID, including related data such as tags, attachments,
 * user information, votes, and nested comments. Also calculates vote summary and the
 * current user's vote on the post.
 *
 * @param post_id - The unique identifier of the post to retrieve.
 * @param user_id - The unique identifier of the user requesting the post (used for filtering votes and comments).
 * @returns A promise that resolves to the post object with related data, vote summary, user vote, and nested comments,
 *          or `null` if the post does not exist.
 */
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
          avatar: true,
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
          avatar: true,
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

/**
 * Creates a new forum post with optional attachments and tags.
 * 
 * This function analyzes the post content for toxicity using an AI model before creation.
 * If the post is deemed toxic or likely to be rejected, it returns an object indicating toxicity.
 * Otherwise, it creates the post, associates any provided attachments and tags, and returns the created post.
 * 
 * @param body - The main content of the post.
 * @param title - The title of the post.
 * @param user_id - The ID of the user creating the post.
 * @param attachments - Optional array of resources to attach to the post. Each attachment must specify a resource type ("NOTE", "QUIZ", or "FLASHCARD") and a resource ID.
 * @param tags - Optional array of tag names to associate with the post.
 * @returns The created post object, or `{ toxic: true }` if the post is considered toxic.
 * @throws If the user does not own an attached resource, an error is thrown.
 */
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
  const response = await _AI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `
                Given the following post data, analyze whether it contains offensive, toxic, hateful, or inappropriate language.
                Check if the post is toxic.
                title: ${title}
                body: ${body.trim()}

                Return a JSON string in this format:
                {
                toxicity: number (0.0 to 1);
                likely_to_reject: number (0.0 to 1);
                }

                Only output the JSON string.
                `.trim(),
  });

  const result = JSON.parse(response.text!.replace(/```json|```/g, ""));

  if (result.toxicity > 0.6 || result.likely_to_reject > 0.5) {
    return { toxic: true };
  }

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

/**
 * Updates an existing forum post with new content, title, and optional attachments.
 * 
 * This function performs the following steps within a database transaction:
 * - Verifies that the post exists and the user is authorized to update it.
 * - Removes all existing attachments from the post.
 * - Validates ownership of each new attachment and adds them to the post.
 * - Updates the post's title, body, and updated timestamp.
 * 
 * @param body - The new content/body of the post.
 * @param title - The new title of the post.
 * @param post_id - The unique identifier of the post to update.
 * @param user_id - The unique identifier of the user attempting the update.
 * @param attachments - Optional array of resources to attach to the post. Each attachment must specify its type and resource ID.
 * 
 * @throws {Error} If the post does not exist, the user is not authorized, or any attachment is invalid or unauthorized.
 * 
 * @returns The updated post object.
 */
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

/**
 * Adds tags to a post by upserting post-tag relationships in the database.
 *
 * For each provided tag ID, this function attempts to create a relationship between
 * the tag and the post. If the relationship already exists, it does nothing (empty update).
 *
 * @param post_id - The unique identifier of the post to which tags will be added.
 * @param tag_ids - An array of tag IDs to associate with the post.
 * @returns A promise that resolves to an array of post-tag relationship objects.
 */
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

/**
 * Deletes a post from the database by its unique identifier.
 *
 * @param post_id - The unique identifier of the post to delete.
 * @returns An object indicating whether the post was successfully deleted.
 */
export async function deletePost(post_id: string) {
  await db_client.post.delete({
    where: { id: post_id },
  });

  return { deleted: true };
}

/**
 * Toggles the visibility of a forum post by updating its `is_public` status.
 *
 * @param visibility - A boolean indicating whether the post should be public (`true`) or private (`false`).
 * @param post_id - The unique identifier of the post to update.
 * @returns A promise that resolves to `true` when the update is successful.
 */
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

/**
 * Searches for public forum posts matching the given query in their title or tags.
 *
 * @param query - The search string to match against post titles and tag names.
 * @param page - The page number for pagination (default is 1).
 * @param limit - The number of posts to return per page (default is 10).
 * @param sort - The sorting method: "newest" (by creation date), "top" (by vote count), or "comments" (by comment count). Default is "newest".
 * @returns An object containing the array of matching posts and the total count of results.
 */
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
    is_resolved: null,
  };

  const posts = await db_client.post.findMany({
    where: baseWhere,
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          avatar: true,
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
