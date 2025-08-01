import { FastifyRequest, FastifyReply } from "fastify";
import {
  getComments,
  commentOnPost,
  replyOnComment,
  updateComment,
  deleteComment,
} from "./comment.service";

export async function get_comments(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { post_id } = request.body as { post_id: string };
  try {
    const comments = await getComments(post_id);

    reply.code(200).send(comments);
  } catch (err) {
    reply.code(500).send({
      message: "Error getting comments.",
    });
  }
}
export async function comment_on_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body, post_id } = request.body as { body: string; post_id: string };
  try {
    const comment = await commentOnPost(body, post_id, request.user.id);

    reply.code(200).send(comment);
  } catch (err) {
    reply.code(500).send({
      message: "Error commenting.",
    });
  }
}
export async function reply_on_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body, comment_id, post_id } = request.body as {
    body: string;
    comment_id: string;
    post_id: string;
  };
  try {
    const reply = await replyOnComment(
      body,
      comment_id,
      request.user.id,
      post_id
    );

    return reply;
  } catch (err) {
    reply.code(500).send({
      message: "Error replying on comment.",
    });
  }
}

export async function update_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body, comment_id } = request.body as {
    body: string;
    comment_id: string;
  };

  try {
    return await updateComment(body, comment_id);
  } catch (err) {
    reply.code(500).send({
      message: "Error updating comment",
    });
  }
}

export async function delete_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { comment_id } = request.body as {
    comment_id: string;
  };

  try {
    return await deleteComment(comment_id);
  } catch (err) {
    reply.code(500).send({
      message: "Error updating comment",
    });
  }
}
