import Fastify from "fastify";
import * as aiService from "../../modules/ai/ai.service";
import {
  generate_quiz_from_note,
  generate_flashcards_from_note,
  generate_quiz_from_prompt,
  generate_flashcards_from_prompt,
  generate_notes_from_prompt,
} from "../../modules/ai/ai.controller";

jest.mock("../../modules/ai/ai.service");

describe("AI Controller", () => {
  const app = Fastify();

  beforeAll(async () => {
    app.post("/ai/quiz/note", generate_quiz_from_note);
    app.post("/ai/flashcard/note", generate_flashcards_from_note);
    app.post("/ai/quiz/prompt", generate_quiz_from_prompt);
    app.post("/ai/flashcard/prompt", generate_flashcards_from_prompt);
    app.post("/ai/notes/prompt", generate_notes_from_prompt);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockContent = {
    title: "Mock Title",
    content: JSON.stringify([{ question: "Sample?", options: ["A", "B", "C", "D"], correctAnswers: [0] }]),
  };

  test("generate_quiz_from_note should return 200 with content", async () => {
    (aiService.generateQuizFromNote as jest.Mock).mockResolvedValue(mockContent);

    const res = await app.inject({
      method: "POST",
      url: "/ai/quiz/note",
      payload: { note_id: "note-1" },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ content: mockContent });
  });

  test("generate_flashcards_from_note should return 200 with content", async () => {
    (aiService.generateFlashcardFromNote as jest.Mock).mockResolvedValue(mockContent);

    const res = await app.inject({
      method: "POST",
      url: "/ai/flashcard/note",
      payload: { note_id: "note-1" },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ content: mockContent });
  });

  test("generate_quiz_from_prompt should return 200 with content", async () => {
    (aiService.generateQuizFromPrompt as jest.Mock).mockResolvedValue(mockContent);

    const res = await app.inject({
      method: "POST",
      url: "/ai/quiz/prompt",
      payload: { prompt: "Explain gravity." },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ content: mockContent });
  });

  test("generate_flashcards_from_prompt should return 200 with content", async () => {
    (aiService.generateFlashcardsFromPrompt as jest.Mock).mockResolvedValue(mockContent);

    const res = await app.inject({
      method: "POST",
      url: "/ai/flashcard/prompt",
      payload: { prompt: "What is energy?" },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ content: mockContent });
  });

  test("generate_notes_from_prompt should return 200 with content", async () => {
    (aiService.generateNotesFromPrompt as jest.Mock).mockResolvedValue("This is a summary.");

    const res = await app.inject({
      method: "POST",
      url: "/ai/notes/prompt",
      payload: { prompt: "Summarize the solar system." },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ content: "This is a summary." });
  });
});
