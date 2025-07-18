import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUserQuiz,
  deleteUserQuiz,
  getQuiz,
  getQuizAttempt,
  getUserQuizzes,
  submitQuizAttempt,
  updateUserQuiz,
  updateUserQuizVisibility,
} from "./quiz.service";
import { z } from "zod";

const CreateUpdateSchema = z.object({
  title: z.string().min(3),
  description: z.string().nullable(),
  quiz_content: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswers: z.array(z.number().int().nonnegative()),
      })
    )
    .min(1),
  is_randomized: z.boolean(),
  timed_quiz: z.number().int().nonnegative(),
});

export async function get_user_quizzes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.id;
    if (!userId) return reply.code(401).send({ message: "Unauthorized." });

    const quizzes = await getUserQuizzes(userId);
    reply.code(200).send(quizzes);
  } catch (err) {
    reply.code(500).send({ message: "Error getting user quizzes." });
  }
}

export async function get_quiz(request: FastifyRequest, reply: FastifyReply) {
  const { quiz_id } = request.params as { quiz_id: string };

  if (!quiz_id)
    return reply.code(400).send({ message: "Quiz ID is required." });

  try {
    const quiz = await getQuiz(quiz_id, request.user.id);
    if (!quiz) return reply.code(404).send({ message: "Quiz not found." });

    return reply.code(200).send(quiz);
  } catch (err) {
    reply.code(500).send({ message: "Error getting quiz." });
  }
}

export async function create_user_quiz(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, description, quiz_content, is_randomized, timed_quiz, isAI } =
    request.body as {
      title: string;
      description: string;
      quiz_content: {
        question: string;
        description?: string;
        options: string[];
        correctAnswers: number[];
      }[];
      is_randomized: boolean;
      timed_quiz: number;
      isAI: boolean;
    };

  const result = CreateUpdateSchema.safeParse({
    title,
    description,
    quiz_content,
    is_randomized,
    timed_quiz,
  });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid quiz data",
      errors: result.error.errors,
    });
  }

  try {
    const quiz = await createUserQuiz(
      title,
      description,
      quiz_content,
      is_randomized,
      timed_quiz,
      request.user.id,
      isAI
    );
    reply.code(201).send(quiz);
  } catch (err) {
    reply.code(500).send({ message: "Error creating quiz." });
  }
}

export async function update_user_quiz(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    title,
    description,
    quiz_content,
    is_randomized,
    timed_quiz,
    quiz_id,
  } = request.body as {
    title: string;
    description: string;
    quiz_content: {
      question: string;
      description: string;
      options: string[];
      correctAnswers: number[];
    }[];
    is_randomized: boolean;
    timed_quiz: number;
    quiz_id: string;
  };

  const result = CreateUpdateSchema.safeParse({
    title,
    description,
    quiz_content,
    is_randomized,
    timed_quiz,
    quiz_id,
  });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    await updateUserQuiz(
      title,
      description,
      quiz_content,
      is_randomized,
      timed_quiz,
      quiz_id
    );
    reply.code(200).send({ message: "Updated quiz." });
  } catch (err) {
    reply.code(500).send({ message: "Error updating quiz." });
  }
}

export async function update_user_quiz_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { visibility, quiz_id } = request.body as {
    visibility: boolean;
    quiz_id: string;
  };

  const schema = z.object({
    visibility: z.boolean(),
    quiz_id: z.string().min(1),
  });

  const result = schema.safeParse({ visibility, quiz_id });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid visibility update",
      errors: result.error.errors,
    });
  }

  try {
    await updateUserQuizVisibility(visibility, quiz_id);
    reply.code(200).send({ message: "Updated quiz visibility." });
  } catch (err) {
    reply.code(500).send({ message: "Error updating quiz visibility." });
  }
}

export async function delete_user_quiz(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { quiz_id } = request.body as { quiz_id: string };

  if (!quiz_id)
    return reply.code(400).send({ message: "Quiz ID is required." });

  try {
    await deleteUserQuiz(quiz_id);
    reply.code(200).send({ message: "Deleted quiz." });
  } catch (err) {
    reply.code(500).send({ message: "Error deleting quiz." });
  }
}

export async function submit_quiz_attempt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { answer_data, started_at, completed_at, duration, score, quiz_id } =
    request.body as {
      answer_data: {
        question: {
          question: string;
          description?: string;
          options: string[];
          correctAnswers: number[];
        };
        user_answer: number[];
      };
      started_at: string;
      completed_at: string;
      duration: number;
      score: number;
      quiz_id: string;
    };

  const schema = z.object({
    answer_data: z.array(
      z.object({
        question: z.object({
          question: z.string(),
          description: z.string().optional(),
          options: z.array(z.string()),
          correctAnswers: z.array(z.number()),
        }),
        user_answer: z.array(z.number()),
      })
    ),
    started_at: z.string(),
    completed_at: z.string(),
    duration: z.number(),
    score: z.number(),
    quiz_id: z.string().min(1),
  });

  const result = schema.safeParse({
    answer_data,
    started_at,
    completed_at,
    duration,
    score,
    quiz_id,
  });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid quiz attempt input",
      errors: result.error.errors,
    });
  }

  try {
    const data = await submitQuizAttempt(
      answer_data,
      started_at,
      completed_at,
      duration,
      score,
      quiz_id,
      request.user.id
    );
    reply.code(200).send(data);
  } catch (err) {
    reply.code(500).send({ message: "Error submitting attempt." });
  }
}

export async function get_quiz_attempt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { attempt_id } = request.params as { attempt_id: string };

  if (!attempt_id)
    return reply.code(400).send({ message: "Attempt ID is required." });

  try {
    const attempt = await getQuizAttempt(attempt_id);
    if (!attempt)
      return reply.code(404).send({ message: "Attempt not found." });

    reply.code(200).send(attempt);
  } catch (err) {
    reply.code(500).send({ message: "Error fetching attempt." });
  }
}
