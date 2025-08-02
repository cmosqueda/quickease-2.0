import {
  createUserFlashcard,
  deleteUserFlashcard,
  getUserFlashcard,
  getUserFlashcards,
  toggleFlashcardVisibility,
  updateUserFlashcard,
} from "../../modules/flashcard/flashcard.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  flashcard: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Flashcard Service", () => {
  const mockUserId = "user-01";
  const mockFlashcardId = "card-001";
  const mockFlashcardData = {
    title: "Python Fundamentals",
    description: "Flashcards for python fundamentals",
    flashcards: [
      { front: "Who created Python?", back: "Guido Van Rossum" },
      { front: "What fictional character is Python named after?", back: "Monty Python" },
    ],
    is_ai_generated: false,
    user_id: mockUserId,
    flashcard_id: mockFlashcardId,
    is_public: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserFlashcards", () => {
    it("should return all flashcards owned by user", async () => {
      (db_client.flashcard.findMany as jest.Mock).mockResolvedValue([mockFlashcardData]);

      const result = await getUserFlashcards(mockUserId);

      expect(db_client.flashcard.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
      });
      expect(result).toEqual([mockFlashcardData]);
    });

    it("should throw an error if fetching flashcards fails", async () => {
      (db_client.flashcard.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(getUserFlashcards(mockUserId)).rejects.toThrow("Database error");
    });
  });

  describe("getUserFlashcard", () => {
    it("should return a specific flashcard owned by user", async () => {
      (db_client.flashcard.findFirst as jest.Mock).mockResolvedValue(mockFlashcardData);

      const result = await getUserFlashcard(mockFlashcardId);

      expect(db_client.flashcard.findFirst).toHaveBeenLastCalledWith({
        where: { id: mockFlashcardId },
      });
      expect(result).toEqual(mockFlashcardData);
    });

    it("should throw an error if flashcard is not found", async () => {
      (db_client.flashcard.findFirst as jest.Mock).mockRejectedValue(new Error("Flashcard not found"));

      await expect(getUserFlashcard(mockFlashcardId)).rejects.toThrow("Flashcard not found");
    });
  });

  describe("createUserFlashcard", () => {
    it("should create a new flashcard object data", async () => {
      (db_client.flashcard.create as jest.Mock).mockResolvedValue(mockFlashcardData);

      const result = await createUserFlashcard(
        mockFlashcardData.title,
        mockFlashcardData.description,
        mockFlashcardData.flashcards,
        mockFlashcardData.is_ai_generated,
        mockUserId
      );

      expect(db_client.flashcard.create).toHaveBeenCalledWith({
        data: {
          title: mockFlashcardData.title,
          description: mockFlashcardData.description,
          flashcards: mockFlashcardData.flashcards,
          is_ai_generated: mockFlashcardData.is_ai_generated,
          user_id: mockUserId,
        },
      });

      expect(result).toEqual(mockFlashcardData);
    });

    it("should throw an error if creation fails", async () => {
      (db_client.flashcard.create as jest.Mock).mockRejectedValue(new Error("Creation failed"));

      await expect(
        createUserFlashcard(
          mockFlashcardData.title,
          mockFlashcardData.description,
          mockFlashcardData.flashcards,
          mockFlashcardData.is_ai_generated,
          mockUserId
        )
      ).rejects.toThrow("Creation failed");
    });
  });

  describe("updateUserFlashcard", () => {
    const mockUpdateFlashcardData = {
      title: "Updated title",
      description: "Updated description",
      flashcards: [
        { front: "Who created Python?", back: "Guido Van Rossum" },
        { front: "What fictional character is Python named after?", back: "Monty Python" },
        { front: "New front", back: "New back" },
      ],
      is_ai_generated: false,
      user_id: mockUserId,
      flashcard_id: mockFlashcardId,
      is_public: false,
    };

    it("should update a flashcard object", async () => {
      (db_client.flashcard.update as jest.Mock).mockResolvedValue(mockUpdateFlashcardData);

      const result = await updateUserFlashcard(
        mockUpdateFlashcardData.title,
        mockUpdateFlashcardData.description,
        mockUpdateFlashcardData.flashcards,
        mockUserId,
        mockFlashcardId
      );

      expect(db_client.flashcard.update).toHaveBeenCalledWith({
        data: {
          title: mockUpdateFlashcardData.title,
          description: mockUpdateFlashcardData.description,
          flashcards: mockUpdateFlashcardData.flashcards,
          user_id: mockUserId,
        },
        where: {
          id: mockFlashcardId,
        },
      });

      expect(result).toEqual(mockUpdateFlashcardData);
    });

    it("should throw an error if update fails", async () => {
      (db_client.flashcard.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await expect(
        updateUserFlashcard(
          mockUpdateFlashcardData.title,
          mockUpdateFlashcardData.description,
          mockUpdateFlashcardData.flashcards,
          mockUserId,
          mockFlashcardId
        )
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteUserFlashcard", () => {
    it("should delete a flashcard", async () => {
      (db_client.flashcard.delete as jest.Mock).mockResolvedValue({});
      const result = await deleteUserFlashcard(mockFlashcardId);

      expect(db_client.flashcard.delete).toHaveBeenCalledWith({
        where: {
          id: mockFlashcardId,
        },
      });
      expect(db_client.flashcard.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it("should throw an error if deletion fails", async () => {
      (db_client.flashcard.delete as jest.Mock).mockRejectedValue(new Error("Deletion failed"));

      await expect(deleteUserFlashcard(mockFlashcardId)).rejects.toThrow("Deletion failed");
    });
  });

  describe("toggleFlashcardVisibility", () => {
    it("should change flashcard's visibility from true to false", async () => {
      (db_client.flashcard.findUnique as jest.Mock).mockResolvedValue({ is_public: true });

      (db_client.flashcard.update as jest.Mock).mockResolvedValue({});

      const result = await toggleFlashcardVisibility(mockFlashcardId);

      expect(db_client.flashcard.findUnique).toHaveBeenCalledWith({
        where: { id: mockFlashcardId },
        select: { is_public: true },
      });

      expect(db_client.flashcard.update).toHaveBeenCalledWith({
        data: { is_public: false },
        where: { id: mockFlashcardId },
      });

      expect(result).toBe(true);
    });

    it("should change flashcard's visibility from false to true", async () => {
      (db_client.flashcard.findUnique as jest.Mock).mockResolvedValue({ is_public: false });

      (db_client.flashcard.update as jest.Mock).mockResolvedValue({});

      const result = await toggleFlashcardVisibility(mockFlashcardId);

      expect(db_client.flashcard.findUnique).toHaveBeenCalledWith({
        where: { id: mockFlashcardId },
        select: { is_public: true },
      });

      expect(db_client.flashcard.update).toHaveBeenCalledWith({
        data: { is_public: true },
        where: { id: mockFlashcardId },
      });

      expect(result).toBe(true);
    });

    it("should throw an error if changing visibility fails", async () => {
      (db_client.flashcard.findUnique as jest.Mock).mockRejectedValue(new Error("Changing visibility failed"));

      await expect(toggleFlashcardVisibility(mockFlashcardId)).rejects.toThrow("Changing visibility failed");
    });
  });
});
