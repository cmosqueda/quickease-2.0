import { FastifyReply, FastifyRequest } from "fastify";
import { reportComment, reportPost } from "./report.service";

export async function report_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { description, post_id } = request.body as {
      description: string;
      post_id: string;
    };

    await reportPost(description, post_id, request.user.id);

    reply.code(201).send({ message: "Reported post." });
  } catch (err) {
    reply.code(500).send({ message: "Error reporting post", errors: err });
  }
}

export async function report_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { description, comment_id } = request.body as {
      description: string;
      comment_id: string;
    };

    await reportComment(description, comment_id, request.user.id);

    reply.code(201).send({ message: "Reported comment." });
  } catch (err) {
    reply.code(500).send({ message: "Error reporting comment", errors: err });
  }
}
