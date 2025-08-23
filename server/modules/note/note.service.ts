import db_client from "../../utils/client";

export async function getUserNotes(user_id: string) {
  try {
    return await db_client.note.findMany({
      where: { user_id },
    });
  } catch (err) {
    throw err;
  }
}

export async function getUserNote(note_id: string) {
  try {
    return await db_client.note.findFirst({
      where: { id: note_id },
    });
  } catch (err) {
    throw err;
  }
}

export async function createUserNote(
  title: string,
  content: string,
  user_id: string,
  is_ai_generated: boolean
) {
  try {
    return await db_client.note.create({
      data: {
        title,
        notes_content: content,
        user_id,
        is_ai_generated,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function updateUserNote(
  title: string,
  content: string,
  note_id: string
) {
  try {
    return await db_client.note.update({
      data: {
        title,
        notes_content: content,
      },
      where: { id: note_id },
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteUserNote(note_id: string) {
  try {
    await db_client.note.delete({
      where: { id: note_id },
    });
    return true;
  } catch (err) {
    throw err;
  }
}

export async function toggleNoteVisibility(
  visibility: boolean,
  note_id: string
) {
  try {
    await db_client.note.update({
      data: { is_public: visibility },
      where: { id: note_id },
    });
    return true;
  } catch (err) {
    throw err;
  }
}
