import db_client from "../../utils/client";

export async function getUserFlashcards(user_id: string) {
    try {
        return await db_client.flashcard.findMany({
            where: { user_id }
        });
    } catch (err) {
        console.error("getUserFlashcards error:", err);
        throw err;
    }
}

export async function getUserFlashcard(flashcard_id: string) {
    try {
        return await db_client.flashcard.findFirst({
            where: { id: flashcard_id }
        });
    } catch (err) {
        console.error("getUserFlashcard error:", err);
        throw err;
    }
}

export async function createUserFlashcard(
    title: string,
    description: string,
    flashcards: { front: string; back: string; }[],
    user_id: string
) {
    try {
        return await db_client.flashcard.create({
            data: {
                title,
                description,
                flashcards,
                user_id,
            }
        });
    } catch (err) {
        console.error("createUserFlashcard error:", err);
        throw err;
    }
}

export async function updateUserFlashcard(
    title: string,
    description: string,
    flashcards: { front: string; back: string; }[],
    user_id: string,
    flashcard_id: string
) {
    try {
        return await db_client.flashcard.update({
            data: {
                title,
                description,
                flashcards,
                user_id
            },
            where: {
                id: flashcard_id
            }
        });
    } catch (err) {
        console.error("updateUserFlashcard error:", err);
        throw err;
    }
}

export async function deleteUserFlashcard(flashcard_id: string) {
    try {
        await db_client.flashcard.delete({
            where: { id: flashcard_id }
        });
        return true;
    } catch (err) {
        console.error("deleteUserFlashcard error:", err);
        throw err;
    }
}

export async function toggleFlashcardVisibility(flashcard_id: string) {
    try {
        const current = await db_client.flashcard.findUnique({
            where: { id: flashcard_id },
            select: { is_public: true }
        });

        const newVisibility = !current?.is_public;

        await db_client.flashcard.update({
            data: { is_public: newVisibility },
            where: { id: flashcard_id }
        });

        return true;
    } catch (err) {
        console.error("toggleFlashcardVisibility error:", err);
        throw err;
    }
}
