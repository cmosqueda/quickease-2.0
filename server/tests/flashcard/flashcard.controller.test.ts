jest.mock("../../modules/flashcard/flashcard.service", () => ({
  getUserFlashcards: jest.fn(),
  getUserFlashcard: jest.fn(),
  createUserFlashcard: jest.fn(),
  updateUserFlashcard: jest.fn(),
  deleteUserFlashcard: jest.fn(),
  toggleFlashcardVisibility: jest.fn(),
}));

import {
  get_user_flashcards,
  get_user_flashcard,
  create_user_flashcard,
  update_user_flashcard,
  delete_user_flashcard,
  toggle_flashcard_visibility,
} from "../../modules/flashcard/flashcard.controller";
import { FastifyReply, FastifyRequest } from "fastify";

import * as flashcardService from "../../modules/flashcard/flashcard.service";

describe("Flashcard Controller", () => {
  const mockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
    setCookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
  } as Partial<FastifyReply> as FastifyReply;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //   get user flashcards
  describe("get_user_flashcards", () => {
    it("should return 401 if user is unauthorized", async () => {
      const mockRequest = {
        user: null,
      } as Partial<FastifyRequest> as FastifyRequest;

      await get_user_flashcards(mockRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 200 and user's flashcard if successful", async () => {
      const mockRequest = {
        user: { id: "1" },
      } as Partial<FastifyRequest> as FastifyRequest;

      const mockFlashcards = [
        {
          title: "Python Fundamentals",
          description: "Flashcards for python fundamentals",
          flashcards: [
            { front: "Who created Python?", back: "Guido Van Rossum" },
            { front: "What fictional character is Python named after?", back: "Monty Python" },
          ],
          is_ai_generated: false,
          user_id: "1",
          flashcard_id: "card-01",
          is_public: false,
        },
      ];

      (flashcardService.getUserFlashcards as jest.Mock).mockResolvedValue(mockFlashcards);

      await get_user_flashcards(mockRequest, mockReply as FastifyReply);

      expect(flashcardService.getUserFlashcards).toHaveBeenCalledWith("1");
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockFlashcards);
    });

    it("should return 500 if there is an error getting user's flashcards", async () => {
      const mockRequest = {
        user: { id: "1" },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.getUserFlashcards as jest.Mock).mockRejectedValue(new Error("Database failure"));

      await get_user_flashcards(mockRequest, mockReply);

      expect(flashcardService.getUserFlashcards).toHaveBeenCalledWith("1");
      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error getting user's flashcards.",
      });
    });
  });

  //   get user flashcard
  describe("get_user_flashcard", () => {
    it("should return 400 if no flashcard id", async () => {
      const mockRequest = {
        params: {
          flashcard_id: null,
        },
      } as Partial<FastifyRequest> as FastifyRequest;

      await get_user_flashcard(mockRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Flashcard ID is required." });
    });

    it("should return 404 if flashcard is not found", async () => {
      const mockRequest = {
        params: {
          flashcard_id: "nonexistent-id",
        },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.getUserFlashcard as jest.Mock).mockResolvedValue(null);
      await get_user_flashcard(mockRequest, mockReply as FastifyReply);

      expect(flashcardService.getUserFlashcard).toHaveBeenCalledWith("nonexistent-id");
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Flashcard not found." });
    });

    it("should return 200 if flashcard is found", async () => {
      const mockRequest = {
        params: {
          flashcard_id: "card-01",
        },
      } as Partial<FastifyRequest> as FastifyRequest;

      const mockFlashcard = {
        title: "Python Fundamentals",
        description: "Flashcards for python fundamentals",
        flashcards: [
          { front: "Who created Python?", back: "Guido Van Rossum" },
          { front: "What fictional character is Python named after?", back: "Monty Python" },
        ],
        is_ai_generated: false,
        user_id: "1",
        flashcard_id: "card-01",
        is_public: false,
      };

      (flashcardService.getUserFlashcard as jest.Mock).mockResolvedValue(mockFlashcard);
      await get_user_flashcard(mockRequest, mockReply as FastifyReply);

      expect(flashcardService.getUserFlashcard).toHaveBeenCalledWith("card-01");
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockFlashcard);
    });

    it("should return 500 if there is an error in getting user's flashcard", async () => {
      const mockRequest = {
        params: {
          flashcard_id: "card-01",
        },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.getUserFlashcard as jest.Mock).mockRejectedValue(new Error("Database failure"));

      await get_user_flashcard(mockRequest, mockReply as FastifyReply);

      expect(flashcardService.getUserFlashcard).toHaveBeenCalledWith("card-01");
      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error getting user's flashcard.",
      });
    });
  });

  //   create user flashcard
  describe("create_user_flashcard", () => {
    const validFlashcardBody = {
      title: "Sample Title",
      description: "A short description",
      isAI: false,
      flashcards: [
        { front: "Q1", back: "A1" },
        { front: "Q2", back: "A2" },
      ],
    };

    it("should return 400 if invalid input", async () => {
      const mockRequest = {
        body: {
          title: "",
          description: "",
          isAI: false,
          flashcards: [],
        },
        user: { id: "user-01" },
      } as Partial<FastifyRequest> as FastifyRequest;

      await create_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ message: "Invalid input" }));
    });

    it("should return 401 if user is not authenticated", async () => {
      const mockRequest = {
        body: validFlashcardBody,
        user: null,
      } as Partial<FastifyRequest> as FastifyRequest;

      await create_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 201 if flashcard is created successfully", async () => {
      const mockRequest = {
        body: validFlashcardBody,
        user: { id: "user-01" },
      } as Partial<FastifyRequest> as FastifyRequest;

      const mockCreatedFlashcard = {
        ...validFlashcardBody,
        flashcard_id: "flashcard-001",
        user_id: "user-01",
        is_public: false,
      };

      (flashcardService.createUserFlashcard as jest.Mock).mockResolvedValue(mockCreatedFlashcard);

      await create_user_flashcard(mockRequest, mockReply);

      expect(flashcardService.createUserFlashcard).toHaveBeenCalledWith(
        validFlashcardBody.title,
        validFlashcardBody.description,
        validFlashcardBody.flashcards,
        validFlashcardBody.isAI,
        "user-01"
      );

      expect(mockReply.code).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith(mockCreatedFlashcard);
    });

    it("should return 500 if service throws", async () => {
      const mockRequest = {
        body: validFlashcardBody,
        user: { id: "user-01" },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.createUserFlashcard as jest.Mock).mockRejectedValue(new Error("Something went wrong"));

      await create_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error creating flashcard.",
      });
    });
  });

  describe("update_user_flashcard", () => {
    const mockRequestBody = {
      title: "Updated Flashcard Title",
      description: "Flashcard Description",
      flashcards: [
        {
          front: "front content",
          back: "back content",
        },
        {
          front: "front content 2",
          back: "back content 2",
        },
      ],
      flashcard_id: "1",
    };

    it("should return 400 if input is invalid", async () => {
      const mockRequest = {
        body: {
          ...mockRequestBody,
          title: "", // invalid
          flashcards: [], // invalid
        },
        user: { id: "user-001" },
      } as Partial<FastifyRequest> as FastifyRequest;

      await update_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ message: "Invalid input" }));
    });

    it("should return 401 if user is not authenticated", async () => {
      const mockRequest = {
        body: mockRequestBody,
        user: null,
      } as Partial<FastifyRequest> as FastifyRequest;

      await update_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 500 if update service throws", async () => {
      const mockRequest = {
        body: mockRequestBody,
        user: { id: "user-001" },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.updateUserFlashcard as jest.Mock).mockRejectedValue(new Error("Something went wrong"));

      await update_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error updating flashcard.",
      });
    });

    it("should return 200 and updated flashcard if successful", async () => {
      const mockRequest = {
        body: mockRequestBody,
        user: { id: "user-001" },
      } as Partial<FastifyRequest> as FastifyRequest;

      const mockUpdatedFlashcard = {
        ...mockRequestBody,
        user_id: "user-001",
        is_public: false,
      };

      (flashcardService.updateUserFlashcard as jest.Mock).mockResolvedValue(mockUpdatedFlashcard);

      await update_user_flashcard(mockRequest, mockReply);

      expect(flashcardService.updateUserFlashcard).toHaveBeenCalledWith(
        mockRequestBody.title,
        mockRequestBody.description,
        mockRequestBody.flashcards,
        "user-001",
        mockRequestBody.flashcard_id
      );

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockUpdatedFlashcard);
    });
  });

  describe("delete_user_flashcard", () => {
    const mockFlashcardId = "card-001";

    it("should return 400 if flashcard_id is missing", async () => {
      const mockRequest = {
        body: {},
      } as Partial<FastifyRequest> as FastifyRequest;

      await delete_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Flashcard ID is required.",
      });
    });

    it("should return 200 if deletion is successful", async () => {
      const mockRequest = {
        body: { flashcard_id: mockFlashcardId },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.deleteUserFlashcard as jest.Mock).mockResolvedValue(true);

      await delete_user_flashcard(mockRequest, mockReply);

      expect(flashcardService.deleteUserFlashcard).toHaveBeenCalledWith(mockFlashcardId);
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Deleted flashcard." });
    });

    it("should return 500 if deletion throws an error", async () => {
      const mockRequest = {
        body: { flashcard_id: mockFlashcardId },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.deleteUserFlashcard as jest.Mock).mockRejectedValue(new Error("Database error"));

      await delete_user_flashcard(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error deleting flashcard.",
      });
    });
  });

  describe("toggle_flashcard_visibility", () => {
    const mockFlashcardId = "card-001";

    it("should return 400 if flashcard_id is missing", async () => {
      const mockRequest = {
        body: {},
      } as Partial<FastifyRequest> as FastifyRequest;

      await toggle_flashcard_visibility(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Flashcard ID is required.",
      });
    });

    it("should return 200 if visibility is toggled successfully", async () => {
      const mockRequest = {
        body: { flashcard_id: mockFlashcardId },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.toggleFlashcardVisibility as jest.Mock).mockResolvedValue(true);

      await toggle_flashcard_visibility(mockRequest, mockReply);

      expect(flashcardService.toggleFlashcardVisibility).toHaveBeenCalledWith(mockFlashcardId);
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Updated flashcard visibility.",
      });
    });

    it("should return 500 if toggle service throws an error", async () => {
      const mockRequest = {
        body: { flashcard_id: mockFlashcardId },
      } as Partial<FastifyRequest> as FastifyRequest;

      (flashcardService.toggleFlashcardVisibility as jest.Mock).mockRejectedValue(new Error("Internal error"));

      await toggle_flashcard_visibility(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error updating flashcard visibility.",
      });
    });
  });
});
