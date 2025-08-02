import {
  generate_quiz_from_prompt,
  generate_flashcards_from_prompt,
  generate_notes_from_prompt,
  generate_quiz_from_note,
  generate_flashcards_from_note,
  generate_flashcards_from_pdf,
  generate_notes_from_pdf,
  generate_quiz_from_pdf,
} from "../../modules/ai/ai.controller";
import * as aiPromptService from "../../modules/ai/ai.prompt.service";
import * as aiNoteService from "../../modules/ai/ai.note.service";
import * as aiUploadService from "../../modules/ai/ai.upload.service";
import { FastifyReply, FastifyRequest } from "fastify";

describe("AI Controller - Generate from Prompt", () => {
  const mockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generate_quiz_from_prompt", () => {
    it("should return 200 with quiz content", async () => {
      const mockRequest = {
        body: { prompt: "Create quiz about Fastify" },
      } as any;

      const mockQuizContent = {
        title: "Fastify Quiz",
        content: JSON.stringify([
          {
            question: "What is Fastify?",
            description: "Basic",
            options: ["Framework", "Language", "Library", "None"],
            correctAnswers: [0],
          },
        ]),
      };

      jest.spyOn(aiPromptService, "generateQuizFromPrompt").mockResolvedValue(mockQuizContent);

      await generate_quiz_from_prompt(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        content: mockQuizContent,
      });
    });

    it("should return 500 if service throws", async () => {
      const mockRequest = {
        body: { prompt: "fail test" },
      } as any;

      jest.spyOn(aiPromptService, "generateQuizFromPrompt").mockRejectedValue(new Error("fail"));

      await generate_quiz_from_prompt(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating flashcards.",
      });
    });
  });

  describe("generate_flashcards_from_prompt", () => {
    it("should return 200 with flashcard content", async () => {
      const mockRequest = {
        body: { prompt: "Explain machine learning basics" },
      } as any;

      const mockFlashcardData = {
        title: "Machine Learning Basics",
        content: JSON.stringify([{ front: "What is ML?", back: "A field of AI focused on learning from data." }]),
      };

      jest.spyOn(aiPromptService, "generateFlashcardsFromPrompt").mockResolvedValue(mockFlashcardData);

      await generate_flashcards_from_prompt(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        content: mockFlashcardData,
      });
    });

    it("should return 500 if service throws", async () => {
      const mockRequest = {
        body: { prompt: "fail test" },
      } as any;

      jest.spyOn(aiPromptService, "generateFlashcardsFromPrompt").mockRejectedValue(new Error("Failed"));

      await generate_flashcards_from_prompt(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating flashcards.",
      });
    });
  });

  describe("generate_notes_from_prompt", () => {
    it("should return 200 with note HTML content", async () => {
      const mockRequest = {
        body: { prompt: "Summarize AI history" },
      } as any;

      const mockNoteContent = `<h1 class="text-4xl">AI History</h1><ul><li>1956: Dartmouth workshop</li></ul>`;

      jest.spyOn(aiPromptService, "generateNotesFromPrompt").mockResolvedValue(mockNoteContent);

      await generate_notes_from_prompt(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        content: mockNoteContent,
      });
    });

    it("should return 500 if service throws", async () => {
      const mockRequest = {
        body: { prompt: "fail test" },
      } as any;

      jest.spyOn(aiPromptService, "generateNotesFromPrompt").mockRejectedValue(new Error("Failed"));

      await generate_notes_from_prompt(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating summary notes.",
      });
    });
  });
});

describe("AI Controller - Generate from Note", () => {
  const mockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generate_quiz_from_note", () => {
    it("should return 200 and quiz content from note", async () => {
      const mockRequest = {
        body: { note_id: "note-123" },
      } as any;

      const mockQuiz = {
        title: "Sample Quiz Title",
        quiz_content: [
          {
            question: "What is AI?",
            description: "Definition question",
            options: ["Artificial Ice", "Artificial Intelligence", "Augmented Interface", "None"],
            correctAnswers: [1],
          },
        ],
      };

      jest.spyOn(aiNoteService, "generateQuizFromNote").mockResolvedValue(mockQuiz);

      await generate_quiz_from_note(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockQuiz);
    });

    it("should return 500 on service error", async () => {
      const mockRequest = {
        body: { note_id: "note-123" },
      } as any;

      jest.spyOn(aiNoteService, "generateQuizFromNote").mockRejectedValue(new Error("Service failed"));

      await generate_quiz_from_note(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating quiz.",
      });
    });
  });

  describe("generate_flashcards_from_note", () => {
    it("should return 200 and flashcard content from note", async () => {
      const mockRequest = {
        body: { note_id: "note-456" },
      } as any;

      const mockFlashcards = {
        title: "Sample Flashcards",
        flashcards: [
          {
            front: "Define AI",
            back: "Artificial Intelligence is the simulation of human intelligence in machines.",
          },
        ],
      };

      jest.spyOn(aiNoteService, "generateFlashcardFromNote").mockResolvedValue(mockFlashcards);

      await generate_flashcards_from_note(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockFlashcards);
    });

    it("should return 500 on service error", async () => {
      const mockRequest = {
        body: { note_id: "note-456" },
      } as any;

      jest.spyOn(aiNoteService, "generateFlashcardFromNote").mockRejectedValue(new Error("Service failed"));

      await generate_flashcards_from_note(mockRequest, mockReply as any);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating flashcards.",
      });
    });
  });
});

// for pdf

jest.mock("../../modules/ai/ai.upload.service");
const mockedAiUploadService = aiUploadService as jest.Mocked<typeof aiUploadService>;

const mockBuffer = Buffer.from("PDF content");
const mockFile = {
  toBuffer: jest.fn().mockResolvedValue(mockBuffer),
};

const createMockRequest = (): FastifyRequest =>
  ({
    file: jest.fn().mockResolvedValue(mockFile),
  } as unknown as FastifyRequest);

const createMockReply = (): FastifyReply =>
  ({
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as FastifyReply);

describe("AI Controller - Generate from PDF", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generate_notes_from_pdf", () => {
    it("should return summary notes from PDF", async () => {
      const mockRequest = createMockRequest();
      const mockReply = createMockReply();
      const mockResult = { title: "PDF Summary", content: "<h1>Note</h1>" };

      mockedAiUploadService.generateSummaryNotesFromPDF.mockResolvedValue(mockResult);

      await generate_notes_from_pdf(mockRequest, mockReply);

      expect(mockRequest.file).toHaveBeenCalled();
      expect(mockedAiUploadService.generateSummaryNotesFromPDF).toHaveBeenCalledWith(mockBuffer);
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockResult);
    });

    it("should return 500 if summary generation fails", async () => {
      const mockRequest = createMockRequest();
      const mockReply = createMockReply();

      mockedAiUploadService.generateSummaryNotesFromPDF.mockRejectedValue(new Error("PDF Error"));

      await generate_notes_from_pdf(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating summary from PDF.",
      });
    });
  });

  describe("generate_quiz_from_pdf", () => {
    it("should return quiz content from PDF", async () => {
      const mockRequest = createMockRequest();
      const mockReply = createMockReply();
      const mockResult = {
        title: "PDF Quiz",
        quiz_content: [
          {
            question: "What is Fastify?",
            description: "Basic framework",
            options: ["Library", "Framework", "Tool", "App"],
            correctAnswers: [1],
          },
        ],
      };

      mockedAiUploadService.generateQuizFromPDF.mockResolvedValue(mockResult);

      await generate_quiz_from_pdf(mockRequest, mockReply);

      expect(mockRequest.file).toHaveBeenCalled();
      expect(mockedAiUploadService.generateQuizFromPDF).toHaveBeenCalledWith(mockBuffer);
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockResult);
    });

    it("should return 500 if quiz generation fails", async () => {
      const mockRequest = createMockRequest();
      const mockReply = createMockReply();

      mockedAiUploadService.generateQuizFromPDF.mockRejectedValue(new Error("PDF quiz error"));

      await generate_quiz_from_pdf(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating quiz from PDF.",
      });
    });
  });

  describe("generate_flashcards_from_pdf", () => {
    it("should return flashcards from PDF", async () => {
      const mockRequest = createMockRequest();
      const mockReply = createMockReply();
      const mockResult = {
        title: "PDF Flashcards",
        flashcards: [
          {
            front: "What is Fastify?",
            back: "A fast Node.js web framework.",
          },
        ],
      };

      mockedAiUploadService.generateFlashcardsFromPDF.mockResolvedValue(mockResult);

      await generate_flashcards_from_pdf(mockRequest, mockReply);

      expect(mockRequest.file).toHaveBeenCalled();
      expect(mockedAiUploadService.generateFlashcardsFromPDF).toHaveBeenCalledWith(mockBuffer);
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockResult);
    });

    it("should return 500 if flashcard generation fails", async () => {
      const mockRequest = createMockRequest();
      const mockReply = createMockReply();

      mockedAiUploadService.generateFlashcardsFromPDF.mockRejectedValue(new Error("Flashcard generation failed"));

      await generate_flashcards_from_pdf(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Error generating summary from PDF.",
      });
    });
  });
});
