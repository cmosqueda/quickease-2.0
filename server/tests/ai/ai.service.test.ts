import * as aiService from "../../modules/ai/ai.service";
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

describe("AI Service", () => {
  const mockNote = {
    id: "note-1",
    title: "Note Title",
    notes_content: "This is a test note content for quiz or flashcard generation.",
  };

  const mockAIResponse = {
    text: JSON.stringify([
      {
        question: "What is 2 + 2?",
        description: "Simple math",
        options: ["1", "2", "3", "4"],
        correctAnswers: [3],
      },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateQuizFromNote", () => {
    it("should return AI response text when note exists", async () => {
      (db_client.note.findUnique as jest.Mock).mockResolvedValue(mockNote);
      (_AI.models.generateContent as jest.Mock).mockResolvedValue(mockAIResponse);

      const result = await aiService.generateQuizFromNote("note-1");
      expect(result).toEqual({
        title: mockNote.title,
        content: mockAIResponse.text.replace(/```json|```/g, ""),
      });
    });

    it("should return false if note not found", async () => {
      (db_client.note.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await aiService.generateQuizFromNote("invalid-note");
      expect(result).toBe(undefined);
    });
  });

  describe("generateFlashcardFromNote", () => {
    it("should return AI response text for flashcards", async () => {
      (db_client.note.findUnique as jest.Mock).mockResolvedValue(mockNote);
      (_AI.models.generateContent as jest.Mock).mockResolvedValue(mockAIResponse);

      const result = await aiService.generateFlashcardFromNote("note-1");
      expect(result).toEqual({
        title: mockNote.title,
        content: mockAIResponse.text.replace(/```json|```/g, ""),
      });
    });
  });

  describe("generateQuizFromPrompt", () => {
    it("should return AI response text from prompt", async () => {
      (_AI.models.generateContent as jest.Mock).mockResolvedValue(mockAIResponse);

      const prompt = "What is AI?";
      const result = await aiService.generateQuizFromPrompt(prompt);
      expect(result).toEqual({
        title: prompt,
        content: mockAIResponse.text.replace(/```json|```/g, ""),
      });
    });
  });

  describe("generateFlashcardsFromPrompt", () => {
    it("should return AI flashcard string from prompt", async () => {
      (_AI.models.generateContent as jest.Mock).mockResolvedValue(mockAIResponse);

      const prompt = "Explain AI concepts.";
      const result = await aiService.generateFlashcardsFromPrompt(prompt);
      expect(result).toEqual({
        title: prompt,
        content: mockAIResponse.text.replace(/```json|```/g, ""),
      });
    });
  });

  describe("generateNotesFromPrompt", () => {
    it("should return generated notes string from prompt", async () => {
      (_AI.models.generateContent as jest.Mock).mockResolvedValue({ text: "```html<h1>Intro</h1>```" });

      const result = await aiService.generateNotesFromPrompt("Explain the basics of AI");
      expect(result).toEqual("<h1>Intro</h1>");
    });
  });
});
