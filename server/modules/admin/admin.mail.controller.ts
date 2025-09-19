import { FastifyReply, FastifyRequest } from "fastify";
import {
  requestVerifyEmail,
  requestChangeEmail,
  requestChangePassword,
} from "../mail/mail.service";

/**
 * Handles a request to send a verification email to a user.
 *
 * @param { user_id: string; } - The Fastify request object containing route parameters.
 * @param reply - The Fastify reply object used to send the response.
 * @returns Sends a response indicating whether the verification email was sent successfully.
 *
 * @remarks
 * Expects `user_id` in the request parameters.
 * On success, responds with status 200 and a message.
 * On failure, responds with status 400 and error details.
 */
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

/**
 * Handles a request to initiate an email change for a user.
 *
 * Sends an email to the user to confirm their request to change their email address.
 * Responds with a success message if the mail is sent, or an error message if the mail fails to send.
 *
 * @param { user_id: string } - The Fastify request object, expected to contain `user_id` in params.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
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

/**
 * Handles a request to initiate a password change for a user.
 *
 * This function extracts the `user_id` from the request parameters and attempts to send a password change email
 * using the `requestChangePassword` service. If successful, it responds with a 200 status and a confirmation message.
 * If the email fails to send, it responds with a 400 status and error details.
 *
 * @param request - The Fastify request object containing route parameters.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves when the response is sent.
 */
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
