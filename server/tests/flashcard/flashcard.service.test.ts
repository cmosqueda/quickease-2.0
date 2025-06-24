import * as flashcardService from "../../modules/flashcard/flashcard.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  flashcard: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Flashcard Service", () => {
  const mockFlashcard = {
    id: "fc-1",
    title: "Test Flashcard",
    description: "Description",
    flashcards: [{ front: "Q1", back: "A1" }],
    user_id: "user-1",
    is_public: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserFlashcards should return flashcards by user ID", async () => {
    (db_client.flashcard.findMany as jest.Mock).mockResolvedValue([mockFlashcard]);
    const result = await flashcardService.getUserFlashcards("user-1");
    expect(result).toEqual([mockFlashcard]);
    expect(db_client.flashcard.findMany).toHaveBeenCalledWith({ where: { user_id: "user-1" } });
  });

  test("getUserFlashcard should return a flashcard by ID", async () => {
    (db_client.flashcard.findFirst as jest.Mock).mockResolvedValue(mockFlashcard);
    const result = await flashcardService.getUserFlashcard("fc-1");
    expect(result).toEqual(mockFlashcard);
    expect(db_client.flashcard.findFirst).toHaveBeenCalledWith({ where: { id: "fc-1" } });
  });

  test("createUserFlashcard should create and return a flashcard", async () => {
    (db_client.flashcard.create as jest.Mock).mockResolvedValue(mockFlashcard);
    const result = await flashcardService.createUserFlashcard(
      "Test Flashcard",
      "Description",
      [{ front: "Q1", back: "A1" }],
      "user-1"
    );
    expect(result).toEqual(mockFlashcard);
    expect(db_client.flashcard.create).toHaveBeenCalledWith({
      data: {
        title: "Test Flashcard",
        description: "Description",
        flashcards: [{ front: "Q1", back: "A1" }],
        user_id: "user-1",
      },
    });
  });

  test("updateUserFlashcard should update and return a flashcard", async () => {
    const updated = { ...mockFlashcard, title: "Updated" };
    (db_client.flashcard.update as jest.Mock).mockResolvedValue(updated);
    const result = await flashcardService.updateUserFlashcard(
      "Updated",
      "Description",
      [{ front: "Q1", back: "A1" }],
      "user-1",
      "fc-1"
    );
    expect(result).toEqual(updated);
    expect(db_client.flashcard.update).toHaveBeenCalledWith({
      data: {
        title: "Updated",
        description: "Description",
        flashcards: [{ front: "Q1", back: "A1" }],
        user_id: "user-1",
      },
      where: { id: "fc-1" },
    });
  });

  test("deleteUserFlashcard should delete and return true", async () => {
    (db_client.flashcard.delete as jest.Mock).mockResolvedValue({});
    const result = await flashcardService.deleteUserFlashcard("fc-1");
    expect(result).toBe(true);
    expect(db_client.flashcard.delete).toHaveBeenCalledWith({ where: { id: "fc-1" } });
  });

  test("toggleFlashcardVisibility should update is_public and return true", async () => {
    (db_client.flashcard.update as jest.Mock).mockResolvedValue({});
    const result = await flashcardService.toggleFlashcardVisibility("fc-1");
    expect(result).toBe(true);
    expect(db_client.flashcard.update).toHaveBeenCalledWith({
      data: { is_public: true },
      where: { id: "fc-1" },
    });
  });
});
