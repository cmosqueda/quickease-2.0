import { FastifyReply, FastifyRequest } from "fastify";
import {
  requestChangeEmail,
  requestChangePassword,
  requestVerifyEmail,
  testEmail,
} from "./mail.service";

export async function test_email(request: FastifyRequest, reply: FastifyReply) {
  const { to, subject, body } = request.body as {
    to: string;
    subject: string;
    body: string;
  };

  try {
    const mail = await testEmail(to, subject, body);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}

export async function request_to_verify_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const mail = await requestVerifyEmail(request.user.id);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}

export async function request_to_change_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const mail = await requestChangeEmail(request.user.id);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}

export async function request_to_change_password(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const mail = await requestChangePassword(request.user.id);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}
