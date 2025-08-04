import { FastifyReply, FastifyRequest } from "fastify";
import {
  requestVerifyEmail,
  requestChangeEmail,
  requestChangePassword,
} from "../mail/mail.service";

export async function request_to_verify_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user_id } = request.params as {
    user_id: string;
  };

  try {
    const mail = await requestVerifyEmail(user_id);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}

export async function request_to_change_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user_id } = request.params as {
    user_id: string;
  };

  try {
    const mail = await requestChangeEmail(user_id);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}

export async function request_to_change_password(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user_id } = request.params as {
    user_id: string;
  };

  try {
    const mail = await requestChangePassword(user_id);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}
