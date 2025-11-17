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

const editNameSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty"),
  lastName: z.string().min(1, "Last name cannot be empty"),
});

const editEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const visibilitySchema = z.object({
  visibility: z.boolean({
    required_error: "Visibility is required",
    invalid_type_error: "Visibility must be a boolean",
  }),
});

const avatarSchema = z.object({
  avatar_id: z.string().min(1, "Avatar ID is required"),
});

const viewProfileSchema = z.object({
  user_id: z.string().uuid("Invalid user ID format"),
});
// ---

export async function get_user(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await getUser(request.user.id);

    if (!user) {
      return reply.code(404).send({ message: "User not found." });
    }

    reply.code(200).send(user);
  } catch (err) {
    reply.code(500).send({ message: "Error getting user's details." });
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
  const result = editNameSchema.safeParse(request.body);

  if (!result.success) {
    return reply
      .code(400)
      .send({ message: "Invalid input", errors: result.error.flatten() });
  }

  try {
    const { firstName, lastName } = result.data;
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
  const result = editEmailSchema.safeParse(request.body);

  if (!result.success) {
    return reply
      .code(400)
      .send({ message: "Invalid input", errors: result.error.flatten() });
  }

  try {
    const update = await changeUserEmail(result.data.email, request.user.id);

    reply.code(200).send({
      message: "Email updated successfully.",
      user: update,
    });
  } catch (err) {
    reply.code(500).send({ message: "Error updating email." });
  }
}

export async function toggle_user_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = visibilitySchema.safeParse(request.body);

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  try {
    const update = await toggleProfileVisibility(
      result.data.visibility,
      request.user.id
    );

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
  const result = viewProfileSchema.safeParse(request.params);

  if (!result.success) {
    return reply
      .code(400)
      .send({ message: "Invalid user ID", errors: result.error.flatten() });
  }

  try {
    const user = await viewProfile(result.data.user_id);

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
  const result = avatarSchema.safeParse(request.body);

  if (!result.success) {
    return reply
      .code(400)
      .send({ message: "Invalid input", errors: result.error.flatten() });
  }

  try {
    const update = await changeAvatar(result.data.avatar_id, request.user.id);

    reply.code(200).send({ message: "Avatar updated.", user: update });
  } catch (err) {
    reply.code(500).send({ message: "Error updating avatar." });
  }
}
