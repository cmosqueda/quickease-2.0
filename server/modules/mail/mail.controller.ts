import { FastifyReply, FastifyRequest } from "fastify";
import {
  requestChangeEmail,
  requestChangePassword,
  requestForgotPassword,
  requestVerifyEmail,
} from "./mail.service";

/**
 * Handles a request to send a verification email to the user.
 *
 * Sends a verification email to the user associated with the request.
 * Responds with a success message if the email is sent, or an error message if it fails.
 *
 * @param { user_id: string; } - The Fastify request object, expected to contain the authenticated user's information.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
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

/**
 * Handles a request to change the user's email address.
 * 
 * Sends an email to the user with instructions to change their email.
 * Responds with a success message if the mail is sent, or an error message if sending fails.
 *
 * @param { user_id: string; } - The Fastify request object, expected to contain the authenticated user's information.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
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

/**
 * Handles a request to initiate a password change process for the authenticated user.
 *
 * Sends an email to the user with instructions to change their password.
 * Responds with a success message if the email is sent successfully,
 * or an error message if the email fails to send.
 *
 * @param { user_id: string; } - The Fastify request object, expected to contain the authenticated user's information.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
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

/**
 * Handles a request to initiate the forgotten password process by sending a reset email.
 *
 * @param { email: string; } - Fastify request object containing the user's email in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a response indicating whether the mail was sent successfully or failed.
 */
export async function request_to_change_forgotten_password(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email } = request.body as {
    email: string;
  };

  try {
    const mail = await requestForgotPassword(email);

    reply.code(200).send({ mail, message: "Mail sent." });
  } catch (err) {
    reply.code(400).send({ message: "Mail failed to send.", errors: err });
  }
}
