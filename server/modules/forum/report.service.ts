import db_client from "../../utils/client";

/**
 * Reports a post by creating a report entry in the database.
 *
 * @param description - A description of the report, explaining the reason for reporting.
 * @param post_id - The unique identifier of the post being reported.
 * @param user_id - The unique identifier of the user submitting the report.
 * @returns A promise that resolves when the report has been created.
 */
export async function reportPost(
  description: string,
  post_id: string,
  user_id: string
) {
  const post = await db_client.post.findUnique({
    where: { id: post_id },
    select: { id: true },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  return db_client.report.upsert({
    where: {
      reported_by_id_reported_post_id: {
        reported_by_id: user_id,
        reported_post_id: post_id,
      },
    },
    update: {
      description: description,
    },
    create: {
      description: description,
      reported_target_type: "POST",
      reported_post_id: post_id,
      reported_by_id: user_id,
    },
  });
}

/**
 * Reports a comment by creating a report entry in the database.
 *
 * @param description - The description or reason for reporting the comment.
 * @param comment_id - The unique identifier of the comment being reported.
 * @param user_id - The unique identifier of the user reporting the comment.
 * @returns A promise that resolves when the report has been created.
 */
export async function reportComment(
  description: string,
  comment_id: string,
  user_id: string
) {
  const comment = await db_client.comment.findUnique({
    where: { id: comment_id },
    select: { id: true },
  });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  return db_client.report.upsert({
    where: {
      reported_by_id_reported_comment_id: {
        reported_by_id: user_id,
        reported_comment_id: comment_id,
      },
    },
    update: {
      description: description,
    },
    create: {
      description: description,
      reported_target_type: "COMMENT",
      reported_comment_id: comment_id,
      reported_by_id: user_id,
    },
  });
}
