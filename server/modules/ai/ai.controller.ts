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
} from "./ai.upload.service";

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

export async function generate_notes_from_pdf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const pdf = await request.file();

  const buffer = await pdf?.toBuffer();

  try {
    const result = await generateSummaryNotesFromPDF(buffer!);

    reply.code(200).send({
      ...result,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating summary from PDF.",
    });
  }
}

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

export async function generate_notes_from_image(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const image = await request.file();

  const buffer = await image?.toBuffer();

  try {
    const result = await generateSummaryNotesFromImage(buffer!);

    reply.code(200).send({
      ...result,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating summary from PDF.",
    });
  }
}
