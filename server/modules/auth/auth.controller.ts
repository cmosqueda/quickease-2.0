import db_client from "../../utils/client";

import { FastifyReply, FastifyRequest } from "fastify";
import { loginUser, registerUser } from "./auth.service";

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
        sameSite: "strict",
      })
      .code(200)
      .send({
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
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .code(201)
      .send({
        role: "user",
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
    reply.clearCookie("QUICKEASE_TOKEN");
    return reply.code(200).send("Logout successfully.");
  } catch (err) {
    return reply.code(500).send("Error occurred while logging out.");
  }
}
