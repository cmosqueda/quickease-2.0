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

/**
 * Handles the request to retrieve a paginated list of users.
 *
 * @param { page?: string; limit?: string } - The Fastify request object, expected to contain optional
 *   - `page`
 *   - `limit`
 * query parameters.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A list of users with HTTP status 200 on success, or an error message with status 500 on failure.
 */
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

/**
 * Handles a request to retrieve a user by their ID.
 *
 * @param { user_id: string } - The Fastify request object
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves with the user data if found, or an error response if fetching fails.
 */
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

/**
 * Handles searching for users based on a query string, with pagination support.
 *
 * @param { q?: string, page?: string, limit?: string,} - The Fastify request object containing query parameters:
 *   - `q`: The search query string (optional).
 *   - `page`: The page number for pagination (optional, defaults to "1").
 *   - `limit`: The number of results per page (optional, defaults to "10").
 * @param reply - The Fastify reply object used to send the response.
 * @returns A list of users matching the search criteria, or an error response if the search fails.
 */
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

/**
 * Updates the email address of a user.
 *
 * @param { new_email: string, user_id: string } - Fastify request object containing the new email in the body and user ID in the params.
 * @param reply - Fastify reply object used to send the response.
 * @returns A promise that resolves with a success response if the email is updated, or an error response if the update fails.
 */
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

/**
 * Updates the password for a specific user.
 *
 * @param { new_password: string, user_id: string } - Fastify request object containing the new password in the body and user ID in the params.
 * @param reply - Fastify reply object used to send the response.
 * @returns A promise that resolves with a success response if the password is updated,
 *          or an error response if the update fails.
 */
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

/**
 * Updates the full name of a user specified by user ID.
 *
 * @param { first_name: string, last_name: string, user_id: string } - Fastify request object
 * @param reply - Fastify reply object used to send the response.
 * @returns A promise that resolves with a success response if the update is successful,
 *          or an error response if the update fails.
 */
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

/**
 * Updates the visibility status of a user.
 *
 * @param { visibility: boolean, user_id: string } - Fastify request object containing the user ID in params and the new visibility status in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns A promise that resolves with a success response if the update is successful,
 *          or an error response if the update fails.
 */
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

/**
 * Deletes a user by their user ID.
 *
 * @param { user_id : string } - Fastify request object containing the user ID in params.
 * @param reply - Fastify reply object used to send the response.
 * @returns A promise that resolves with a success response if the user is deleted,
 *          or an error response if the deletion fails.
 */
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
