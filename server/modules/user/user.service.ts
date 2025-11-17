import db_client from "../../utils/client";

/**
 * Retrieves a user by their unique identifier, including counts of related items.
 *
 * @param user_id - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object with associated counts, or `null` if not found.
 */
export async function getUser(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      avatar: true,
      badges: true,
      is_admin: true,
      is_verified: true,
      is_public: true,
      created_at: true,
      // Add other user fields you need

      // Get counts instead of all related data
      _count: {
        select: {
          flashcards: true,
          quizzes: true,
          notes: true,
          posts: true,
          comments: true,
        },
      },
    },
  });

  return user;
}

/**
 * Retrieves a user by their unique ID and selects specific fields.
 *
 * @param user_id - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to an object containing the user's first name, last name, and admin status,
 * or `null` if no user is found.
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
 * Retrieves the profile information for a user by their ID using a two-step query.
 *
 * If the user's profile is public, returns detailed information.
 * If the profile is not public or user not found, returns minimal info or null.
 *
 * @param user_id - The unique identifier of the user whose profile is to be viewed.
 * @returns A promise that resolves to the user's profile information.
 */
export async function viewProfile(user_id: string) {
  // Step 1: Fetch basic info and visibility
  const userBasics = await db_client.user.findUnique({
    where: { id: user_id },
    select: {
      first_name: true,
      last_name: true,
      is_public: true,
    },
  });

  if (!userBasics) {
    return null; // User not found
  }

  // Step 2: If not public, return the minimal data
  if (!userBasics.is_public) {
    return userBasics;
  }

  // Step 3: If public, fetch the full, rich data
  const userProfile = await db_client.user.findUnique({
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

  return userProfile;
}

/**
 * Changes the avatar of a user by updating the user's avatar ID in the database.
 *
 * @param avatar_id - The ID of the new avatar to assign to the user.
 * @param user_id - The ID of the user whose avatar is to be changed.
 * @returns A promise that resolves to the updated user object.
 */
export async function changeAvatar(avatar_id: string, user_id: string) {
  const update = await db_client.user.update({
    data: {
      avatar: avatar_id,
    },
    where: {
      id: user_id,
    },
  });

  return update;
}
