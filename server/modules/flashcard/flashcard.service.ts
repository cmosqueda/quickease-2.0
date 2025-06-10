import db_client from "../../utils/client";

export async function getUserFlashcards(user_id: string) {
    const flashcards = await db_client.flashcard.findMany({
        where: {
            user_id: user_id
        }
    })

    return flashcards
}

export async function createUserFlashcard(title: string, description: string, flashcards: { front: string; back: string; }[], user_id: string) {
    const flashcard = await db_client.flashcard.create({
        data: {
            title,
            description,
            flashcards: flashcards,
            user_id,
        }
    })

    return flashcard
}

export async function updateUserFlashcard(title: string, description: string, flashcards: { front: string; back: string; }[], user_id: string, flashcard_id: string) {
    const flashcard = await db_client.flashcard.update({
        data: {
            title,
            description,
            flashcards: flashcards,
            user_id,
        },
        where: {
            id: flashcard_id
        }
    })

    return flashcard
}

export async function deleteUserFlashcard(flashcard_id: string) {
    await db_client.flashcard.delete({ where: { id: flashcard_id } })
    return true
}

export async function toggleFlashcardVisibility(flashcard_id: string) {
    await db_client.flashcard.update({ data: { is_public: true }, where: { id: flashcard_id } })
    return true
}