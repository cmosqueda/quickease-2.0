import db_client from "../../utils/client";

/**
 * Retrieves a user by their unique identifier, including related flashcards, quizzes, and notes.
 *
 * @param user_id - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object with associated flashcards, quizzes, and notes, or `null` if not found.
 */
export async function getUser(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
    include: { flashcards: true, quizzes: true, notes: true },
  });

  return user;
}

/**
 * Retrieves a user by their unique ID and selects specific fields.
 *
 * @param user_id - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to an object containing the user's first name, last name, and admin status,
 *          or `null` if no user is found.
 */
export async function checkUser(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
    select: {
      first_name: true,
      last_name: true,
      is_admin: true,
    },
  });

  return user;
}

/**
 * Updates the first and last name of a user in the database.
 *
 * @param first_name - The new first name for the user.
 * @param last_name - The new last name for the user.
 * @param user_id - The unique identifier of the user to update.
 * @returns A promise that resolves to the updated user object.
 */
export async function changeUserName(
  first_name: string,
  last_name: string,
  user_id: string
) {
  return await db_client.user.update({
    data: {
      first_name: first_name,
      last_name: last_name,
    },
    where: {
      id: user_id,
    },
  });
}

/**
 * Updates the email address of a user in the database.
 *
 * @param email - The new email address to set for the user.
 * @param user_id - The unique identifier of the user whose email is to be changed.
 * @returns A promise that resolves to the updated user object.
 */
export async function changeUserEmail(email: string, user_id: string) {
  return await db_client.user.update({
    data: {
      email: email,
    },
    where: {
      id: user_id,
    },
  });
}

/**
 * Toggles the profile visibility for a user.
 *
 * Updates the `is_public` field of the user with the specified `user_id`.
 *
 * @param visibility - The desired visibility state (`true` for public, `false` for private).
 * @param user_id - The unique identifier of the user whose profile visibility is to be updated.
 * @returns A promise that resolves to the updated user object.
 */
export async function toggleProfileVisibility(
  visibility: boolean,
  user_id: string
) {
  const update = await db_client.user.update({
    data: {
      is_public: visibility,
    },
    where: {
      id: user_id,
    },
  });

  return update;
}

/**
 * Retrieves the profile information for a user by their ID.
 *
 * If the user's profile is public, returns detailed information including comments, badges, avatar, and posts.
 * If the profile is not public, returns only the user's first name, last name, and public status.
 *
 * @param user_id - The unique identifier of the user whose profile is to be viewed.
 * @returns A promise that resolves to the user's profile information, with details depending on the profile's public status.
 */
export async function viewProfile(user_id: string) {
  const user = await db_client.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      first_name: true,
      last_name: true,
      comments: true,
      badges: true,
      avatar: true,
      posts: {
        include: { user: true },
        where: { is_resolved: null },
      },
      is_public: true,
    },
  });

  if (user?.is_public) {
    return user;
  } else {
    return {
      first_name: user?.first_name,
      last_name: user?.last_name,
      is_public: false,
    };
  }
}

/**
 * Changes the avatar of a user by updating the user's avatar ID in the database.
 *
 * @param avatar_id - The ID of the new avatar to assign to the user.
 * @param user_id - The ID of the user whose avatar is to be changed.
 * @returns A promise that resolves to `true` when the avatar has been successfully updated.
 */
export async function changeAvatar(avatar_id: string, user_id: string) {
  await db_client.user.update({
    data: {
      avatar: avatar_id,
    },
    where: {
      id: user_id,
    },
  });

  return true;
}
