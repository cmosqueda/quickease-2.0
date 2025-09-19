import db_client from "../../utils/client";

/**
 * Retrieves all flashcards associated with a specific user.
 *
 * @param user_id - The unique identifier of the user whose flashcards are to be fetched.
 * @returns A promise that resolves to an array of flashcards belonging to the user.
 * @throws Will throw an error if the database query fails.
 */
export async function getUserFlashcards(user_id: string) {
  try {
    return await db_client.flashcard.findMany({
      where: { user_id },
    });
  } catch (err) {
    throw err;
  }
}

/**
 * Retrieves a flashcard for a user by its unique identifier.
 *
 * @param flashcard_id - The unique identifier of the flashcard to retrieve.
 * @returns A promise that resolves to the flashcard object if found, or `null` if not found.
 * @throws Will throw an error if the database query fails.
 */
export async function getUserFlashcard(flashcard_id: string) {
  try {
    return await db_client.flashcard.findFirst({
      where: { id: flashcard_id },
    });
  } catch (err) {
    throw err;
  }
}

/**
 * Creates a new user flashcard set in the database.
 *
 * @param title - The title of the flashcard set.
 * @param description - A description of the flashcard set.
 * @param flashcards - An array of flashcard objects, each containing a `front` and `back` string.
 * @param is_ai_generated - Indicates whether the flashcards are AI-generated.
 * @param user_id - The ID of the user creating the flashcard set.
 * @returns The created flashcard set object from the database.
 * @throws Will throw an error if the database operation fails.
 */
export async function createUserFlashcard(
  title: string,
  description: string,
  flashcards: { front: string; back: string }[],
  is_ai_generated: boolean,
  user_id: string
) {
  try {
    return await db_client.flashcard.create({
      data: {
        title,
        description,
        flashcards,
        is_ai_generated,
        user_id,
      },
    });
  } catch (err) {
    throw err;
  }
}

/**
 * Updates an existing flashcard for a specific user.
 *
 * @param title - The new title of the flashcard.
 * @param description - The new description of the flashcard.
 * @param flashcards - An array of flashcard objects containing `front` and `back` text.
 * @param user_id - The ID of the user who owns the flashcard.
 * @param flashcard_id - The ID of the flashcard to update.
 * @returns A promise that resolves to the updated flashcard object.
 * @throws Will throw an error if the update operation fails.
 */
export async function updateUserFlashcard(
  title: string,
  description: string,
  flashcards: { front: string; back: string }[],
  user_id: string,
  flashcard_id: string
) {
  try {
    return await db_client.flashcard.update({
      data: {
        title,
        description,
        flashcards,
        user_id,
      },
      where: {
        id: flashcard_id,
      },
    });
  } catch (err) {
    throw err;
  }
}

/**
 * Deletes a user flashcard from the database by its ID.
 *
 * @param flashcard_id - The unique identifier of the flashcard to delete.
 * @returns A promise that resolves to `true` if the deletion was successful.
 * @throws Will throw an error if the deletion fails.
 */
export async function deleteUserFlashcard(flashcard_id: string) {
  try {
    await db_client.flashcard.delete({
      where: { id: flashcard_id },
    });
    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * Toggles the visibility of a flashcard between public and private.
 *
 * Retrieves the current visibility state (`is_public`) of the flashcard with the given ID,
 * inverts it, and updates the flashcard record in the database.
 *
 * @param flashcard_id - The unique identifier of the flashcard to update.
 * @returns A promise that resolves to `true` if the operation succeeds.
 * @throws Throws an error if the database operation fails.
 */
export async function toggleFlashcardVisibility(flashcard_id: string) {
  try {
    const current = await db_client.flashcard.findUnique({
      where: { id: flashcard_id },
      select: { is_public: true },
    });

    const newVisibility = !current?.is_public;

    await db_client.flashcard.update({
      data: { is_public: newVisibility },
      where: { id: flashcard_id },
    });

    return true;
  } catch (err) {
    throw err;
  }
}
