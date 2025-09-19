import db_client from "../../utils/client";
import z from "zod";

import { FastifyReply, FastifyRequest } from "fastify";
import {
  loginUser,
  registerUser,
  updateEmail,
  updatePassword,
  verifyEmail,
} from "./auth.service";

/**
 * Handles user login requests.
 *
 * Validates the provided email and password, attempts to authenticate the user,
 * and returns a JWT token in a secure HTTP-only cookie if successful.
 *
 * @param { email: string; password: string; } - FastifyRequest containing the user's email and password in the body.
 * @param reply - FastifyReply used to send responses and set cookies.
 * @returns Sends a 200 response with user data and JWT cookie on success,
 *          a 400 response if credentials are missing or invalid,
 *          or a 500 response on server error.
 */
export async function login_user(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply
        .code(400)
        .send({ message: "Email and password are required." });
    }

    const user = await loginUser(email, password);

    if (!user) {
      return reply
        .code(400)
        .send({ message: "Invalid email/password, check your credentials." });
    }

    const token = await reply.jwtSign(user);

    reply
      .setCookie("QUICKEASE_TOKEN", token, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .code(200)
      .send({
        ...user,
        password: null,
        is_admin: user.is_admin,
      });
  } catch (err) {
    reply.code(500).send({
      message: "Internal server error. Please try again later.",
      errors: err,
    });
  }
}

/**
 * Registers a new user with the provided details.
 *
 * @param { firstName: string; lastName: string; email: string; password: string; } - Fastify request object containing user registration data (firstName, lastName, email, password).
 * @param reply - Fastify reply object used to send responses and set cookies.
 * @returns Sends a response with the newly created user (excluding password) and sets a JWT token cookie on success.
 *          On validation errors, sends a 400 response with an appropriate message.
 *          If the email is already in use, sends a 406 response.
 *          On server errors, sends a 500 response with error details.
 */
export async function register_user(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { firstName, lastName, email, password } = request.body as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };

    if (!firstName) {
      return reply.code(400).send({ message: "Error: First name required." });
    }
    if (!lastName) {
      return reply.code(400).send({ message: "Error: Last name required." });
    }

    if (!email) {
      return reply.code(400).send({ message: "Error: Email required." });
    }

    if (!password) {
      return reply.code(400).send({ message: "Error: Password required." });
    }

    const existed = await db_client.user.findUnique({
      where: { email },
    });

    if (existed) {
      return reply.code(406).send({ message: "Email already in use." });
    }

    const user = await registerUser(firstName, lastName, email, password);
    const token = await reply.jwtSign(user);

    reply
      .setCookie("QUICKEASE_TOKEN", token, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .code(201)
      .send({
        ...user,
        password: null,
        is_admin: false,
      });
  } catch (err) {
    console.error("Register error:", err);
    reply.code(500).send({
      message: "Internal server error. Could not register user.",
      errors: err,
    });
  }
}

/**
 * Logs out the user by clearing the authentication cookie.
 *
 * @param request - The Fastify request object.
 * @param reply - The Fastify reply object.
 * @returns A response indicating the result of the logout operation.
 *
 * @remarks
 * This function clears the "QUICKEASE_TOKEN" cookie and sends a success message.
 * If an error occurs during the process, it sends an error message with a 500 status code.
 */
export async function logout(request: FastifyRequest, reply: FastifyReply) {
  try {
    reply.clearCookie("QUICKEASE_TOKEN", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return reply.code(200).send("Logout successfully.");
  } catch (err) {
    return reply.code(500).send("Error occurred while logging out.");
  }
}

/**
 * Handles the password update request for a user.
 *
 * Validates the request body using a Zod schema to ensure the presence of a valid email,
 * a non-empty token, and a new password with a minimum length of 6 characters.
 * If validation passes, attempts to update the user's password using the provided credentials.
 * Responds with a 200 status code and a success message if the update is successful.
 * Responds with a 400 status code and validation errors if the request body is invalid.
 * Responds with a 500 status code and error details if an unexpected error occurs during processing.
 *
 * @param { email: string; token: string; new_password: string; } - The Fastify request object containing the request body.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves when the response is sent.
 */
export async function update_password(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updatePasswordSchema = z.object({
    email: z.string().email(),
    token: z.string().min(1),
    new_password: z.string().min(6),
  });

  try {
    const parseResult = updatePasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        message: "Invalid request body",
        errors: parseResult.error.flatten(),
      });
    }

    const { email, token, new_password } = parseResult.data;
    const result = await updatePassword(email, token, new_password);

    reply.code(200).send({ updated: result, message: "Password updated" });
  } catch (err) {
    reply.code(500).send({
      message: "Error updating password",
      errors: err instanceof Error ? err.message : err,
    });
  }
}

/**
 * Handles the request to update a user's email address.
 *
 * Validates the request body using Zod schema to ensure the presence of a valid current email,
 * a token, and a new email address. If validation passes, attempts to update the email using
 * the `updateEmail` service. Responds with appropriate HTTP status codes and messages based
 * on the outcome.
 *
 * @param { email: string; token: string; new_email: string; } - FastifyRequest containing the request body with `email`, `token`, and `new_email`.
 * @param reply - FastifyReply used to send the response.
 * @returns Sends a response with status 200 if the email is updated successfully,
 *          400 if the request body is invalid, or 500 if an error occurs during the update.
 */
export async function update_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateEmailSchema = z.object({
    email: z.string().email(),
    token: z.string().min(1),
    new_email: z.string().email(),
  });

  try {
    const parseResult = updateEmailSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        message: "Invalid request body",
        errors: parseResult.error.flatten(),
      });
    }

    const { email, token, new_email } = parseResult.data;
    const result = await updateEmail(email, token, new_email);

    reply.code(200).send({ updated: result, message: "Email updated" });
  } catch (err) {
    reply.code(500).send({
      message: "Error updating email",
      errors: err instanceof Error ? err.message : err,
    });
  }
}

/**
 * Verifies a user's email address using a provided token.
 *
 * Validates the request body to ensure it contains a valid email and token.
 * If validation succeeds, attempts to verify the email using the `verifyEmail` function.
 * Responds with a success message and verification result if successful.
 * Returns a 400 error if the request body is invalid, or a 500 error if an exception occurs.
 *
 * @param { email: string; token:string; } - The Fastify request object containing the email and token in the body.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves with the verification result or an error response.
 */
export async function verify_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateEmailSchema = z.object({
    email: z.string().email(),
    token: z.string().min(1),
  });

  try {
    const parseResult = updateEmailSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        message: "Invalid request body",
        errors: parseResult.error.flatten(),
      });
    }

    const { email, token } = parseResult.data;
    const result = await verifyEmail(email, token);

    reply.code(200).send({ updated: result, message: "Verification success." });
  } catch (err) {
    reply.code(500).send({
      message: "Error updating email",
      errors: err instanceof Error ? err.message : err,
    });
  }
}
