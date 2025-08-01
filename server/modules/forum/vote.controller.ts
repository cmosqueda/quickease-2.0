import { FastifyRequest, FastifyReply } from "fastify";
import { voteOnComment, voteOnPost } from "./vote.service";

export async function vote_on_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { vote_type, post_id } = request.body as {
    vote_type: number;
    post_id: string;
  };
  try {
    const vote = await voteOnPost(vote_type, post_id, request.user.id);

    reply.code(200).send(vote);
  } catch (err) {
    reply.code(500).send({
      message: "Error voting on comment.",
    });
  }
}

export async function vote_on_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { vote_type, comment_id } = request.body as {
    vote_type: number;
    comment_id: string;
  };
  try {
    const vote = await voteOnComment(vote_type, comment_id, request.user.id);

    reply.code(200).send(vote);
  } catch (err) {
    reply.code(500).send({
      message: "Error voting on comment.",
    });
  }
}
