import {
  generateFlashcardsFromPDF,
  generateQuizFromPDF,
  generateSummaryNotesFromPDF,
} from "../../modules/ai/ai.upload.service";

import _AI from "../../utils/ai";

jest.mock("../../utils/ai", () => ({
  models: {
    generateContent: jest.fn(),
  },
}));

describe("AI Upload Services", () => {
  const fakePdfBuffer = Buffer.from("Fake PDF Content");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateSummaryNotesFromPDF", () => {
    it("should return parsed summary notes", async () => {
      const mockRaw = {
        title: "Sample Notes",
        content: `<h1 class="text-4xl">PDF Summary</h1>`,
      };

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockRaw)}\n\`\`\``,
      });

      const result = await generateSummaryNotesFromPDF(fakePdfBuffer);

      expect(result).toEqual(mockRaw);
    });

    it("should return false if Gemini throws error", async () => {
      (_AI.models.generateContent as jest.Mock).mockRejectedValue(new Error("PDF error"));

      const result = await generateSummaryNotesFromPDF(fakePdfBuffer);
      expect(result).toBe(false);
    });
  });

  describe("generateQuizFromPDF", () => {
    it("should return parsed quiz content", async () => {
      const mockRaw = {
        title: "Quiz from PDF",
        quiz_content: [
          {
            question: "What is PDF?",
            description: "Test",
            options: ["Portable", "Document", "Format", "None"],
            correctAnswers: [0, 1, 2],
          },
        ],
      };

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockRaw)}\n\`\`\``,
      });

      const result = await generateQuizFromPDF(fakePdfBuffer);

      expect(result).toEqual(mockRaw);
    });

    it("should return false on failure", async () => {
      (_AI.models.generateContent as jest.Mock).mockRejectedValue(new Error("Gemini error"));

      const result = await generateQuizFromPDF(fakePdfBuffer);
      expect(result).toBe(false);
    });
  });

  describe("generateFlashcardsFromPDF", () => {
    it("should return parsed flashcard data", async () => {
      const mockRaw = {
        title: "Flashcards Title",
        flashcards: [{ front: "What is Fastify?", back: "A fast Node.js web framework." }],
      };

      (_AI.models.generateContent as jest.Mock).mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockRaw)}\n\`\`\``,
      });

      const result = await generateFlashcardsFromPDF(fakePdfBuffer);

      expect(result).toEqual(mockRaw);
    });

    it("should return false on failure", async () => {
      (_AI.models.generateContent as jest.Mock).mockRejectedValue(new Error("Gemini fail"));

      const result = await generateFlashcardsFromPDF(fakePdfBuffer);
      expect(result).toBe(false);
    });
  });
});
