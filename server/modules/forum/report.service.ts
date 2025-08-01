import db_client from "../../utils/client";

export async function reportPost(
  description: string,
  post_id: string,
  user_id: string
) {
  await db_client.report.create({
    data: {
      description: description,
      reported_target_type: "POST",
      reported_post_id: post_id,
      reported_by_id: user_id,
    },
  });
}

export async function reportComment(
  description: string,
  comment_id: string,
  user_id: string
) {
  await db_client.report.create({
    data: {
      description: description,
      reported_target_type: "COMMENT",
      reported_comment_id: comment_id,
      reported_by_id: user_id,
    },
  });
}
