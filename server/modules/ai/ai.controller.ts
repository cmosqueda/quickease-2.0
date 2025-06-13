import { FastifyReply, FastifyRequest } from "fastify";
<<<<<<< HEAD
import {
  generateFlashcardFromNote,
  generateFlashcardsFromPrompt,
  generateQuizFromNote,
  generateQuizFromPrompt,
} from "./ai.service";
=======
import { generateFlashcardFromNote, generateFlashcardsFromPrompt, generateNotesFromPrompt, generateQuizFromNote, generateQuizFromPrompt } from "./ai.service";
>>>>>>> idok/main

export async function generate_quiz_from_note(request: FastifyRequest, reply: FastifyReply) {
  const { note_id } = request.body as {
    note_id: string;
  };

<<<<<<< HEAD
  try {
    const generatedContent = await generateQuizFromNote(note_id);
=======
    try {
        const generatedContent = await generateQuizFromNote(note_id)
>>>>>>> idok/main

    reply.code(200).send({
      content: generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating quiz.",
    });
  }
}

export async function generate_flashcards_from_note(request: FastifyRequest, reply: FastifyReply) {
  const { note_id } = request.body as {
    note_id: string;
  };

<<<<<<< HEAD
  try {
    const generatedContent = await generateFlashcardFromNote(note_id);
=======
    try {
        const generatedContent = await generateFlashcardFromNote(note_id)
>>>>>>> idok/main

    reply.code(200).send({
      content: generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating flashcards.",
    });
  }
}

export async function generate_quiz_from_prompt(request: FastifyRequest, reply: FastifyReply) {
  const { prompt } = request.body as {
    prompt: string;
  };

<<<<<<< HEAD
  try {
    const generatedContent = await generateQuizFromPrompt(prompt);
=======
    try {
        const generatedContent = await generateQuizFromPrompt(prompt)
>>>>>>> idok/main

    reply.code(200).send({
      content: generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating flashcards.",
    });
  }
}

export async function generate_flashcards_from_prompt(request: FastifyRequest, reply: FastifyReply) {
  const { prompt } = request.body as {
    prompt: string;
  };

<<<<<<< HEAD
  try {
    const generatedContent = await generateFlashcardsFromPrompt(prompt);

    reply.code(200).send({
      content: generatedContent,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error generating flashcards.",
    });
  }
}
=======
    try {
        const generatedContent = await generateFlashcardsFromPrompt(prompt)

        reply.code(200).send({
            content: generatedContent
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error generating flashcards."
        })
    }
}

export async function generate_notes_from_prompt(request: FastifyRequest, reply: FastifyReply) {
    const { prompt } = request.body as {
        prompt: string
    }

    try {
        const generatedContent = await generateNotesFromPrompt(prompt)

        reply.code(200).send({
            content: generatedContent
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error generating summary notes."
        })
    }

}
>>>>>>> idok/main
