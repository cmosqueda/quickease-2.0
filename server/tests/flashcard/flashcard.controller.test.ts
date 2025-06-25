import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import * as flashcardService from "../../modules/flashcard/flashcard.service";
import {
  get_user_flashcards,
  get_user_flashcard,
  create_user_flashcard,
  update_user_flashcard,
  delete_user_flashcard,
  toggle_flashcard_visibility,
} from "../../modules/flashcard/flashcard.controller";

jest.mock("../../modules/flashcard/flashcard.service");

const mockFlashcard = {
  id: "fc-1",
  title: "Test Flashcard",
  description: "Description",
  flashcards: [{ front: "Q1", back: "A1" }],
  user_id: "user-1",
  is_public: false,
};

describe("Flashcard Controller", () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(() => {
    // Decorate globally ONCE
    Fastify().decorateRequest("user", null as any);
  });

  beforeEach(async () => {
    app = Fastify();

    await app.register(fastifyJwt, { secret: "test-secret" });

    // Use the already declared decorator
    app.addHook("preHandler", async (req: any) => {
      req.user = { id: "user-1" };
    });

    app.get("/flashcards", get_user_flashcards);
    app.get("/flashcards/:flashcard_id", get_user_flashcard);
    app.post("/flashcards", create_user_flashcard);
    app.put("/flashcards", update_user_flashcard);
    app.delete("/flashcards", delete_user_flashcard);
    app.post("/flashcards/visibility", toggle_flashcard_visibility);

    await app.ready();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //   test
  test("get_user_flashcards should return 200 with flashcards", async () => {
    (flashcardService.getUserFlashcards as jest.Mock).mockResolvedValue([mockFlashcard]);

    const res = await app.inject({ method: "GET", url: "/flashcards" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([mockFlashcard]);
  });

  test("get_user_flashcard should return 200 with a flashcard", async () => {
    (flashcardService.getUserFlashcard as jest.Mock).mockResolvedValue(mockFlashcard);

    const res = await app.inject({ method: "GET", url: "/flashcards/fc-1" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(mockFlashcard);
  });

  test("create_user_flashcard should return 201 on valid input", async () => {
    (flashcardService.createUserFlashcard as jest.Mock).mockResolvedValue(mockFlashcard);

    const res = await app.inject({
      method: "POST",
      url: "/flashcards",
      payload: {
        title: "New Flashcard",
        description: "This is a valid description",
        flashcards: [{ front: "F1", back: "B1" }],
      },
    });

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toEqual(mockFlashcard);
  });

  test("create_user_flashcard should return 400 on invalid input", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/flashcards",
      payload: {
        title: "A",
        description: null,
        flashcards: [],
      },
    });

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe("Invalid input");
  });

  test("update_user_flashcard should return 200 on valid input", async () => {
    const updated = { ...mockFlashcard, title: "Updated Flashcard" };
    (flashcardService.updateUserFlashcard as jest.Mock).mockResolvedValue(updated);

    const res = await app.inject({
      method: "PUT",
      url: "/flashcards",
      payload: {
        title: "Updated Flashcard",
        description: "Updated valid description",
        flashcards: [{ front: "F1", back: "B1" }],
        flashcard_id: "fc-1",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(updated);
  });

  test("update_user_flashcard should return 400 on invalid input", async () => {
    const res = await app.inject({
      method: "PUT",
      url: "/flashcards",
      payload: {
        title: "Shrt",
        description: "Too short",
        flashcards: [],
        flashcard_id: "",
      },
    });

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe("Invalid input");
  });

  test("delete_user_flashcard should return 200 on success", async () => {
    (flashcardService.deleteUserFlashcard as jest.Mock).mockResolvedValue(true);

    const res = await app.inject({
      method: "DELETE",
      url: "/flashcards",
      payload: { flashcard_id: "fc-1" },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("Deleted flashcard.");
  });

  test("toggle_flashcard_visibility should return 200 on success", async () => {
    (flashcardService.toggleFlashcardVisibility as jest.Mock).mockResolvedValue(true);

    const res = await app.inject({
      method: "POST",
      url: "/flashcards/visibility",
      payload: { flashcard_id: "fc-1" },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("Updated flashcard visibility.");
  });
});
