import db_client from '../../utils/client'
import { z } from 'zod'

export async function getUserNotes(user_id: string) {
    const notes = await db_client.note.findMany({
        where: {
            user_id: user_id
        }
    })

    return notes
}

export async function createUserNote(title: string, content: string, user_id: string) {
    const notes = await db_client.note.create({
        data: {
            title: title,
            notes_content: content,
            user_id: user_id
        }
    })

    return notes
}

export async function updateUserNote(title: string, content: string, note_id: string, user_id: string) {
    const notes = await db_client.note.update({
        data: {
            title: title,
            notes_content: content,
            user_id: user_id
        },
        where: {
            id: note_id
        }
    })

    return notes
}

export async function deleteUserNote(note_id: string) {
    await db_client.note.delete({
        where: {
            id: note_id
        }
    })

    return true
}

export async function toggleNoteVisibility(visibility: boolean, note_id: string) {
    await db_client.note.update({
        data: {
            is_public: visibility
        },
        where: {
            id: note_id
        }
    })

    return true
}