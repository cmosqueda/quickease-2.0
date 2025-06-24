import * as noteService from "../../modules/note/note.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    note: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Note Service", () => {
  const mockUserId = "user-123";
  const mockNoteId = "note-456";
  const mockNote = {
    id: mockNoteId,
    title: "Test Note",
    notes_content: "This is a test note.",
    user_id: mockUserId,
    is_public: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserNotes should return notes by user ID", async () => {
    (db_client.note.findMany as jest.Mock).mockResolvedValue([mockNote]);
    const result = await noteService.getUserNotes(mockUserId);
    expect(db_client.note.findMany).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
    expect(result).toEqual([mockNote]);
  });

  test("getUserNote should return single note by ID", async () => {
    (db_client.note.findFirst as jest.Mock).mockResolvedValue(mockNote);
    const result = await noteService.getUserNote(mockNoteId);
    expect(db_client.note.findFirst).toHaveBeenCalledWith({ where: { id: mockNoteId } });
    expect(result).toEqual(mockNote);
  });

  test("createUserNote should create and return a note", async () => {
    (db_client.note.create as jest.Mock).mockResolvedValue(mockNote);
    const result = await noteService.createUserNote(mockNote.title, mockNote.notes_content, mockUserId);
    expect(db_client.note.create).toHaveBeenCalledWith({
      data: {
        title: mockNote.title,
        notes_content: mockNote.notes_content,
        user_id: mockUserId,
      },
    });
    expect(result).toEqual(mockNote);
  });

  test("updateUserNote should update and return the note", async () => {
    const updatedNote = { ...mockNote, title: "Updated Title" };
    (db_client.note.update as jest.Mock).mockResolvedValue(updatedNote);
    const result = await noteService.updateUserNote("Updated Title", mockNote.notes_content, mockNoteId);
    expect(db_client.note.update).toHaveBeenCalledWith({
      data: {
        title: "Updated Title",
        notes_content: mockNote.notes_content,
      },
      where: {
        id: mockNoteId,
      },
    });
    expect(result).toEqual(updatedNote);
  });

  test("deleteUserNote should delete note and return true", async () => {
    (db_client.note.delete as jest.Mock).mockResolvedValue(undefined);
    const result = await noteService.deleteUserNote(mockNoteId);
    expect(db_client.note.delete).toHaveBeenCalledWith({ where: { id: mockNoteId } });
    expect(result).toBe(true);
  });

  test("toggleNoteVisibility should update is_public and return true", async () => {
    (db_client.note.update as jest.Mock).mockResolvedValue(undefined);
    const result = await noteService.toggleNoteVisibility(true, mockNoteId);
    expect(db_client.note.update).toHaveBeenCalledWith({
      data: { is_public: true },
      where: { id: mockNoteId },
    });
    expect(result).toBe(true);
  });
});
