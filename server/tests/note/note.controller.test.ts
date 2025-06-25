import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import * as noteService from "../../modules/note/note.service";
import {
  get_user_notes,
  get_user_note,
  create_user_note,
  update_user_note,
  delete_user_note,
  toggle_user_note_visibility,
} from "../../modules/note/note.controller";

const mockNote = {
  id: "note-1",
  title: "Test Note",
  notes_content: "Sample content",
  user_id: "user-1",
  is_public: false,
};

jest.mock("../../modules/note/note.service");

describe("Note Controller", () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify();

    // Register JWT plugin
    await app.register(fastifyJwt, { secret: "test-secret" });

    // PreHandler mock for request.user
    app.addHook("preHandler", async (req: any) => {
      req.user = {
        id: "user-1",
        first_name: "Mock",
        last_name: "User",
        email: "mock@example.com",
        phone_number: "1234567890",
        is_public: true,
      };
    });

    // Register routes AFTER plugin & hook
    app.get("/notes", get_user_notes);
    app.get("/notes/:note_id", get_user_note);
    app.post("/notes", create_user_note);
    app.put("/notes", update_user_note);
    app.delete("/notes", delete_user_note);
    app.post("/notes/visibility", toggle_user_note_visibility);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //   get all user notes
  test("get_user_notes should return 200 with notes", async () => {
    (noteService.getUserNotes as jest.Mock).mockResolvedValue([mockNote]);

    const response = await app.inject({ method: "GET", url: "/notes" });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual([mockNote]);
  });

  //   get user notes by id
  test("get_user_note should return 200 with single note", async () => {
    (noteService.getUserNote as jest.Mock).mockResolvedValue(mockNote);

    const response = await app.inject({ method: "GET", url: "/notes/note-1" });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockNote);
  });

  //   create user note
  test("create_user_note should return 201 with created note", async () => {
    (noteService.createUserNote as jest.Mock).mockResolvedValue(mockNote);

    const response = await app.inject({
      method: "POST",
      url: "/notes",
      payload: { title: "Test Note", content: "Sample content", user_id: "user-1" },
    });
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual(mockNote);
  });

  //   update a user note
  test("update_user_note should return 200 with updated note", async () => {
    const updated = { ...mockNote, title: "Updated" };
    (noteService.updateUserNote as jest.Mock).mockResolvedValue(updated);

    const response = await app.inject({
      method: "PUT",
      url: "/notes",
      payload: { title: "Updated", content: "Updated content", note_id: "note-1" },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(updated);
  });

  //   delete a user note
  test("delete_user_note should return 200 on success", async () => {
    (noteService.deleteUserNote as jest.Mock).mockResolvedValue(true);

    const response = await app.inject({
      method: "DELETE",
      url: "/notes",
      payload: { note_id: "note-1" },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: "Note deleted successfully." });
  });

  //   toggle note visibility
  test("toggle_user_note_visibility should return 200 on success", async () => {
    (noteService.toggleNoteVisibility as jest.Mock).mockResolvedValue(true);

    const response = await app.inject({
      method: "POST",
      url: "/notes/visibility",
      payload: { visibility: true, note_id: "note-1" },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: "Note visibility updated." });
  });

  test("create_user_note should return 400 on invalid input", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/notes",
      payload: { title: "A", content: null, user_id: "" },
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("Invalid input");
  });
});
