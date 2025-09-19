import db_client from "../../utils/client";

import { hashPassword } from "../../utils/hash";

/**
 * Retrieves a paginated list of non-admin users from the database.
 *
 * @param page - The page number to retrieve (defaults to 1).
 * @param limit - The number of users per page (defaults to 10).
 * @returns An object containing the users, total count, current page, and total pages.
 */
export async function getUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db_client.user.findMany({
      skip,
      take: limit,
      where: {
        is_admin: false,
      },
    }),
    db_client.user.count({
      where: {
        is_admin: false,
      },
    }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Retrieves a user from the database by their unique user ID.
 *
 * @param user_id - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object if found, or `null` if no user matches the provided ID.
 */
export async function getUser(user_id: string) {
  const user = await db_client.user.findFirst({
    where: {
      id: user_id,
    },
  });

  return user;
}

/**
 * Searches for non-admin users based on a query string, with pagination support.
 *
 * The search is performed on the user's first name, last name, or email, using
 * case-insensitive partial matching. Results are ordered by creation date in descending order.
 *
 * @param query - The search string to match against user fields.
 * @param page - The page number for pagination (default is 1).
 * @param limit - The number of users to return per page (default is 10).
 * @returns An object containing the matched users, total count, current page, and total pages.
 */
export async function searchUsers(query: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db_client.user.findMany({
      where: {
        is_admin: false,
        OR: [
          {
            first_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            last_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        is_verified: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    }),

    db_client.user.count({
      where: {
        is_admin: false,
        OR: [
          {
            first_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            last_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Updates the email address of a user in the database.
 *
 * @param new_email - The new email address to set for the user.
 * @param user_id - The unique identifier of the user whose email is to be updated.
 * @returns A promise that resolves to `true` when the update is successful.
 */
export async function updateUserEmail(new_email: string, user_id: string) {
  await db_client.user.update({
    data: {
      email: new_email,
      updated_at: new Date(),
    },
    where: {
      id: user_id,
    },
  });

  return true;
}

/**
 * Updates the password for a user by hashing the new password and saving it to the database.
 *
 * @param new_password - The new password to set for the user.
 * @param user_id - The unique identifier of the user whose password is to be updated.
 * @returns A promise that resolves when the user's password has been updated.
 */
export async function updateUserPassword(
  new_password: string,
  user_id: string
) {
  const hashedNewPassword = await hashPassword(new_password);

  await db_client.user.update({
    data: {
      password: hashedNewPassword,
      updated_at: new Date(),
    },
    where: {
      id: user_id,
    },
  });
}

/**
 * Updates the full name of a user in the database.
 *
 * @param first_name - The new first name of the user.
 * @param last_name - The new last name of the user.
 * @param user_id - The unique identifier of the user to update.
 * @returns A promise that resolves when the user's name has been updated.
 */
export async function updateUserFullName(
  first_name: string,
  last_name: string,
  user_id: string
) {
  await db_client.user.update({
    data: {
      first_name,
      last_name,
      updated_at: new Date(),
    },
    where: {
      id: user_id,
    },
  });
}

/**
 * Updates the visibility status of a user.
 *
 * @param visibility - A boolean indicating whether the user should be public (`true`) or private (`false`).
 * @param user_id - The unique identifier of the user whose visibility is to be updated.
 * @returns A promise that resolves when the user's visibility has been updated.
 */
export async function updateUserVisibility(
  visibility: boolean,
  user_id: string
) {
  await db_client.user.update({
    data: {
      is_public: visibility,
    },
    where: {
      id: user_id,
    },
  });
}

/**
 * Deletes a user from the database by their unique user ID.
 *
 * @param user_id - The unique identifier of the user to be deleted.
 * @returns A promise that resolves when the user has been deleted.
 */
export async function deleteUser(user_id: string) {
  await db_client.user.delete({
    where: {
      id: user_id,
    },
  });
}
