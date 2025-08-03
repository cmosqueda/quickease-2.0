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
    });
  }
}

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
    });
  }
}

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
