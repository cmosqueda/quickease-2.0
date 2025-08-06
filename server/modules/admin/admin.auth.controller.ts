import { FastifyRequest, FastifyReply } from "fastify";
import {
  getUsers,
  searchUsers,
  updateUserEmail,
  updateUserPassword,
  updateUserFullName,
  updateUserVisibility,
  deleteUser,
  getUser,
} from "./admin.auth.service";

export async function get_users(request: FastifyRequest, reply: FastifyReply) {
  try {
    const query = request.query as { page?: string; limit?: string };

    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);

    const users = await getUsers(page, limit);

    return reply.code(200).send(users);
  } catch {
    return reply.code(500).send({ error: "failed_to_fetch_users" });
  }
}

export async function get_user(request: FastifyRequest, reply: FastifyReply) {
  const { user_id } = request.params as {
    user_id: string;
  };

  try {
    const user = await getUser(user_id);
    return reply.code(200).send(user);
  } catch {
    return reply.code(500).send({ error: "failed_to_fetch_users" });
  }
}

export async function search_users(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const {
      q = "",
      page = "1",
      limit = "10",
    } = request.query as {
      q?: string;
      page?: string;
      limit?: string;
    };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await searchUsers(q, pageNum, limitNum);
    return reply.code(200).send(result);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: "failed_to_search_users" });
  }
}

export async function update_user_email(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { new_email } = request.body as { new_email: string };
    const { user_id } = request.params as { user_id: string };

    await updateUserEmail(new_email, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_update_email" });
  }
}

export async function update_user_password(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { new_password } = request.body as { new_password: string };
    const { user_id } = request.params as { user_id: string };

    await updateUserPassword(new_password, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_update_password" });
  }
}

export async function update_user_full_name(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { first_name, last_name } = request.body as {
      first_name: string;
      last_name: string;
    };
    const { user_id } = request.params as { user_id: string };

    await updateUserFullName(first_name, last_name, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_update_full_name" });
  }
}

export async function update_user_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { visibility } = request.body as { visibility: boolean };
    const { user_id } = request.params as { user_id: string };

    await updateUserVisibility(visibility, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_update_visibility" });
  }
}

export async function delete_user(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { user_id } = request.params as { user_id: string };

    await deleteUser(user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_delete_user" });
  }
}
