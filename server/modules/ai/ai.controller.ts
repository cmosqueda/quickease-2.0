import { FastifyReply, FastifyRequest } from "fastify";
import {
  generateQuizFromNote,
  generateFlashcardFromNote,
} from "./ai.note.service";

import {
  generateQuizFromPrompt,
  generateFlashcardsFromPrompt,
  generateNotesFromPrompt,
} from "./ai.prompt.service";

import {
  generateSummaryNotesFromPDF,
  generateQuizFromPDF,
  generateFlashcardsFromPDF,
  generateSummaryNotesFromImage,
  generateFlashcardsFromImage,
  generateQuizFromImage,
} from "./ai.upload.service";

/**
 * Generates a quiz based on the provided note ID.
 *
 * @param { note_id: string } - Fastify request object containing the note ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a generated quiz content on success, or an error message on failure.
 */
export async function generate_quiz_from_note(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { note_id } = request.body as {
    note_id: string;
  };

  try {
    const generatedContent = await generateQuizFromNote(note_id);

    reply.code(200).send({
      ...generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating quiz.",
    });
  }
}

/**
 * Generates flashcards from a given note.
 *
 * @param { note_id: string; } - Fastify request object containing the note ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a 200 response with the generated flashcards content on success,
 *          or a 500 response with an error message on failure.
 */
export async function generate_flashcards_from_note(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { note_id } = request.body as {
    note_id: string;
  };

  try {
    const generatedContent = await generateFlashcardFromNote(note_id);

    reply.code(200).send({
      ...generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating flashcards.",
    });
  }
}

/**
 * Handles the generation of a quiz based on a provided prompt.
 *
 * @param { prompt: string; } - The Fastify request object containing the prompt in the body.
 * @param reply - The Fastify reply object used to send the response.
 * @returns Sends a generated quiz content on success, or an error message on failure.
 */
export async function generate_quiz_from_prompt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { prompt } = request.body as {
    prompt: string;
  };

  try {
    const generatedContent = await generateQuizFromPrompt(prompt);

    reply.code(200).send({
      ...generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating flashcards.",
    });
  }
}

/**
 * Handles the generation of flashcards based on a given prompt.
 *
 * @param { prompt: string; } - The Fastify request object containing the prompt in the body.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A response containing the generated flashcards or an error message.
 *
 * @throws Sends a 500 error response if flashcard generation fails.
 */
export async function generate_flashcards_from_prompt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { prompt } = request.body as {
    prompt: string;
  };

  try {
    const generatedContent = await generateFlashcardsFromPrompt(prompt);

    reply.code(200).send({
      ...generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating flashcards.",
    });
  }
}

/**
 * Handles the generation of summary notes from a given prompt.
 *
 * @param { prompt: string; } - The Fastify request object containing the prompt in the body.
 * @param reply - The Fastify reply object used to send the response.
 * @returns Sends a response with the generated notes content on success,
 *          or an error message on failure.
 */
export async function generate_notes_from_prompt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { prompt } = request.body as {
    prompt: string;
  };

  try {
    const generatedContent = await generateNotesFromPrompt(prompt);

    reply.code(200).send({
      generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating summary notes.",
    });
  }
}

/**
 * Handles a request to generate summary notes from an uploaded PDF file.
 *
 * This function expects a PDF file to be uploaded in the request, processes it,
 * and generates summary notes using the `generateSummaryNotesFromPDF` function.
 * On success, it responds with the generated notes and a 200 status code.
 * On failure, it responds with a 500 status code and an error message.
 *
 * @param request - The Fastify request object containing the uploaded PDF file.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
export async function generate_notes_from_pdf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { auto } = request.query as { auto?: string };
  const enableAutoGenerate = auto === "true";

  const pdf = await request.file();
  const buffer = await pdf?.toBuffer();

  if (!buffer) {
    return reply.code(400).send({ message: "No file uploaded" });
  }

  try {
    const noteResult = await generateSummaryNotesFromPDF(buffer);

    if (!noteResult) {
      throw new Error("Failed to generate note");
    }

    let quizResult = null;
    let flashcardResult = null;

    if (enableAutoGenerate) {
      quizResult = await generateQuizFromPDF(buffer);

      flashcardResult = await generateFlashcardsFromPDF(buffer);
    }

    reply.code(200).send({
      note: noteResult,
      quiz: quizResult,
      flashcards: flashcardResult,
    });
  } catch (err) {
    console.error(err);
    reply.code(500).send({
      message: "Error generating content from PDF.",
    });
  }
}

/**
 * Handles the generation of a quiz from an uploaded PDF file.
 *
 * This endpoint expects a PDF file to be uploaded in the request. It reads the file,
 * converts it to a buffer, and passes it to the `generateQuizFromPDF` function to
 * generate quiz questions based on the PDF content. The generated quiz is sent back
 * in the response with a 200 status code. If an error occurs during processing,
 * a 500 status code and an error message are returned.
 *
 * @param request - The Fastify request object containing the uploaded PDF file.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
export async function generate_quiz_from_pdf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const pdf = await request.file();

  const buffer = await pdf?.toBuffer();

  try {
    const result = await generateQuizFromPDF(buffer!);

    reply.code(200).send({
      ...result,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating quiz from PDF.",
    });
  }
}

/**
 * Handles a Fastify request to generate flashcards from an uploaded PDF file.
 *
 * This function expects a PDF file to be uploaded in the request. It reads the file,
 * converts it to a buffer, and passes it to the `generateFlashcardsFromPDF` function.
 * On success, it responds with the generated flashcards. On failure, it sends a 500 error response.
 *
 * @param request - The Fastify request object containing the uploaded PDF file.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves when the response is sent.
 */
export async function generate_flashcards_from_pdf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const pdf = await request.file();

  const buffer = await pdf?.toBuffer();

  try {
    const result = await generateFlashcardsFromPDF(buffer!);

    reply.code(200).send({
      ...result,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating summary from PDF.",
    });
  }
}

/**
 * Generates summary notes from an uploaded image.
 *
 * This function handles a Fastify request containing an image file,
 * processes the image to extract summary notes, and sends the result
 * in the response. If an error occurs during processing, it responds
 * with a 500 status code and an error message.
 *
 * @param request - The Fastify request object containing the image file.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
export async function generate_notes_from_image(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { auto } = request.query as { auto?: string };
  const enableAutoGenerate = auto === "true";

  const image = await request.file();
  const buffer = await image?.toBuffer();

  if (!buffer) {
    return reply.code(400).send({ message: "No file uploaded" });
  }

  try {
    const noteResult = await generateSummaryNotesFromImage(buffer);

    if (!noteResult) {
      throw new Error("Failed to generate note");
    }

    let quizResult = null;
    let flashcardResult = null;

    if (enableAutoGenerate) {
      quizResult = await generateQuizFromImage(buffer);
      flashcardResult = await generateFlashcardsFromImage(buffer);
    }

    reply.code(200).send({
      note: noteResult,
      quiz: quizResult,
      flashcards: flashcardResult,
    });
  } catch (err) {
    console.error(err);
    reply.code(500).send({
      message: "Error generating content from Image.",
    });
  }
}