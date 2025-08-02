// ai.prompt.service.test.ts

import {
  generateQuizFromPrompt,
  generateFlashcardsFromPrompt,
  generateNotesFromPrompt,
} from "../../modules/ai/ai.prompt.service";
import _AI from "../../utils/ai";

jest.mock("../../utils/ai", () => ({
  models: {
    generateContent: jest.fn(),
  },
}));

describe("AI Prompt Services", () => {
  const mockQuizPrompt = "Create a short quiz about python programming.";
  const mockFlashcardPrompt = "Create a 10-item flashcard set about python programming.";
  const mockNotePrompt = "Create a note summary explaining programming in python.";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateQuizFromPrompt", () => {
    it("should return a quiz object when prompt is provided", async () => {
      const mockQuizJson = JSON.stringify([
        {
          question: "What is a variable in Python?",
          description: "Basic knowledge check",
          options: ["Integer", "Container", "Storage", "None of the above"],
          correctAnswers: [2],
        },
      ]);

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json${mockQuizJson}\`\`\``,
      });

      const result = await generateQuizFromPrompt(mockQuizPrompt);

      expect(result).toEqual({
        title: mockQuizPrompt,
        content: mockQuizJson,
      });

      expect(_AI.models.generateContent).toHaveBeenCalled();
    });

    it("should return false if an error occurs", async () => {
      (_AI.models.generateContent as jest.Mock).mockRejectedValue(new Error("Gemini Error"));

      const result = await generateQuizFromPrompt(mockQuizPrompt);
      expect(result).toBe(false);
    });
  });

  describe("generateFlashcardsFromPrompt", () => {
    it("should return a flashcard object when prompt is provided", async () => {
      const mockFlashcardsJson = JSON.stringify([
        { front: "What is Python?", back: "A high-level programming language." },
        { front: "Who created Python?", back: "Guido van Rossum." },
      ]);

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json${mockFlashcardsJson}\`\`\``,
      });

      const result = await generateFlashcardsFromPrompt(mockFlashcardPrompt);

      expect(result).toEqual({
        title: mockFlashcardPrompt,
        content: mockFlashcardsJson,
      });
      expect(_AI.models.generateContent).toHaveBeenCalled();
    });

    it("should return false if an error occurs", async () => {
      (_AI.models.generateContent as jest.Mock).mockRejectedValue(new Error("Gemini Error"));

      const result = await generateFlashcardsFromPrompt(mockFlashcardPrompt);
      expect(result).toBe(false);
    });
  });

  describe("generateNotesFromPrompt", () => {
    it("should return an HTML string of the notes", async () => {
      const mockNoteHtml = `<h1 class="text-4xl">Python Basics</h1><ul class="list-disc"><li>Variables</li></ul>`;

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`html${mockNoteHtml}\`\`\``,
      });

      const result = await generateNotesFromPrompt(mockNotePrompt);

      expect(result).toBe(mockNoteHtml);
      expect(_AI.models.generateContent).toHaveBeenCalled();
    });

    it("should return false if an error occurs", async () => {
      (_AI.models.generateContent as jest.Mock).mockRejectedValue(new Error("Gemini Error"));

      const result = await generateNotesFromPrompt(mockNotePrompt);
      expect(result).toBe(false);
    });
  });
});
