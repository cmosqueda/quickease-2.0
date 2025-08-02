// ai.note.service.test.ts

import { generateQuizFromNote, generateFlashcardFromNote } from "../../modules/ai/ai.note.service";
import db_client from "../../utils/client";
import _AI from "../../utils/ai";

jest.mock("../../utils/client", () => ({
  note: {
    findUnique: jest.fn(),
  },
}));

jest.mock("../../utils/ai", () => ({
  models: {
    generateContent: jest.fn(),
  },
}));

describe("AI Note Services", () => {
  const mockNoteId = "1";
  const mockNoteContent = "This is a sample note about programming fundamentals.";

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  describe("generateQuizFromNote", () => {
    it("should return a quiz object when note is found", async () => {
      const mockQuiz = {
        title: "Programming Quiz",
        quiz_content: [
          {
            question: "What is a variable?",
            description: "A basic concept in programming.",
            options: ["Box", "Car", "Function", "Loop"],
            correctAnswers: [0],
          },
        ],
      };

      // Mock db_client.note.findUnique
      (db_client.note.findUnique as jest.Mock).mockResolvedValue({
        id: mockNoteId,
        notes_content: mockNoteContent,
      });

      // Mock Gemini's response
      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockQuiz)}\n\`\`\``,
      });

      const result = await generateQuizFromNote(mockNoteId);

      expect(result).toEqual(mockQuiz);
      expect(db_client.note.findUnique).toHaveBeenCalledWith({ where: { id: mockNoteId } });
      expect(_AI.models.generateContent).toHaveBeenCalled();
    });

    it("should return undefined if note is not found", async () => {
      (db_client.note.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await generateQuizFromNote(mockNoteId);
      expect(result).toBe(undefined);
    });
  });

  describe("generateFlashcardFromNote", () => {
    it("should return flashcards object when note is found", async () => {
      const mockFlashcards = {
        title: "Programming Flashcards",
        flashcards: [
          {
            front: "What is a function?",
            back: "A reusable block of code.",
          },
        ],
      };

      (db_client.note.findUnique as jest.Mock).mockResolvedValue({
        id: mockNoteId,
        notes_content: mockNoteContent,
      });

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockFlashcards)}\n\`\`\``,
      });

      const result = await generateFlashcardFromNote(mockNoteId);

      expect(result).toEqual(mockFlashcards);
      expect(db_client.note.findUnique).toHaveBeenCalled();
      expect(_AI.models.generateContent).toHaveBeenCalled();
    });

    it("should return undefined if note is not found", async () => {
      (db_client.note.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await generateFlashcardFromNote(mockNoteId);
      expect(result).toBe(undefined);
    });
  });
});
