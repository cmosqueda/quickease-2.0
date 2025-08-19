import { FastifyRequest, FastifyReply } from "fastify";
import {
  changeAvatar,
  changeUserEmail,
  changeUserName,
  checkUser,
  getUser,
  toggleProfileVisibility,
  viewProfile,
} from "./user.service";
import { z } from "zod";

export async function get_user(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await getUser(request.user.id);

    if (!user) {
      return reply.code(404).send({ message: "User not found." });
    }

    reply.code(200).send(user);
  } catch (err) {
    reply
      .code(500)
      .send({ message: "Error getting user's details.", error: err });
  }
}

export async function check_user(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await checkUser(request.user.id);

    if (!user) {
      return reply.code(404).send({ message: "User not found." });
    }

    reply.code(200).send(user);
  } catch (err) {
    reply.code(500).send({ message: "Error getting user's details." });
  }
}

export async function edit_user_name(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { firstName, lastName } = request.body as {
    firstName: string;
    lastName: string;
  };

  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });

  const result = schema.safeParse(request.body);
  if (!result.success) {
    return reply
      .code(400)
      .send({ message: "Invalid input", errors: result.error.errors });
  }

  try {
    const update = await changeUserName(firstName, lastName, request.user.id);
    reply.code(200).send({
      message: "Name updated successfully.",
      user: update,
    });
  } catch (err) {
    reply.code(500).send({ message: "Error updating name." });
  }
}

export async function edit_email(request: FastifyRequest, reply: FastifyReply) {
  const { email } = request.body as {
    email: string;
  };

  const schema = z.object({
    email: z.string().email(),
  });

  const result = schema.safeParse(request.body);
  if (!result.success) {
    return reply
      .code(400)
      .send({ message: "Invalid input", errors: result.error.errors });
  }

  try {
    const update = await changeUserEmail(email, request.user.id);
    reply.code(200).send({
      message: "Email updated successfully.",
      user: update,
    });
  } catch (err) {
    reply.code(500).send({ message: "Error updating name." });
  }
}

export async function toggle_user_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { visibility } = request.body as { visibility: boolean };

  const schema = z.boolean();
  const result = schema.safeParse(visibility);

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    const update = await toggleProfileVisibility(visibility, request.user.id);
    reply.code(200).send({
      message: "Profile visibility updated.",
      user: update,
    });
  } catch (err) {
    reply.code(500).send({ message: "Error updating profile visibility." });
  }
}

export async function view_profile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user_id } = request.params as { user_id: string };

  try {
    const user = await viewProfile(user_id);

    if (!user) {
      return reply.code(404).send({ message: "User not found." });
    }

    reply.code(200).send(user);
  } catch (err) {
    reply.code(500).send({ message: "Error getting user's details." });
  }
}

export async function change_avatar(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { avatar_id,  } = request.body as {
    avatar_id: string;
  };

  try {
    await changeAvatar(avatar_id, request.user.id);

    reply.code(200).send({ message: "Avatar updated." });
  } catch (err) {
    reply.code(500).send({ message: "Error getting user's details." });
  }
}
