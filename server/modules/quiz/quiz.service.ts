import db_client from "../../utils/client";

/**
 * Retrieves all quizzes associated with a specific user.
 *
 * @param user_id - The unique identifier of the user whose quizzes are to be fetched.
 * @returns A promise that resolves to an array of quizzes belonging to the user.
 * @throws Will throw an error if the database query fails.
 */
export async function getUserQuizzes(user_id: string) {
  try {
    return await db_client.quiz.findMany({ where: { user_id } });
  } catch (err) {
    throw err;
  }
}

/**
 * Retrieves a quiz by its ID along with the current user's attempts and the quiz leaderboard.
 *
 * @param quiz_id - The unique identifier of the quiz to fetch.
 * @param user_id - The unique identifier of the user whose attempts are to be included.
 * @returns An object containing the quiz details, the user's attempts, and the leaderboard (top 10 public attempts).
 * @throws Will throw an error if the database query fails.
 */
export async function getQuiz(quiz_id: string, user_id: string) {
  const quiz = await db_client.quiz.findFirst({
    where: {
      id: quiz_id,
      OR: [{ is_public: true }, { user_id: user_id }],
    },
    include: {
      attempts: {
        where: { user_id },
        orderBy: { completed_at: "desc" },
      },
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found or not accessible.");
  }

  const leaderboard = await db_client.quizAttempt.findMany({
    where: {
      quiz_id,
      is_public: true,
    },
    orderBy: [{ score: "desc" }, { duration: "asc" }],
    take: 10,
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    },
  });

  return { ...quiz, leaderboard };
}

/**
 * Creates a new quiz for a user with the specified parameters.
 *
 * @param title - The title of the quiz.
 * @param description - A brief description of the quiz.
 * @param quiz_content - An array of quiz questions, each containing the question text, optional description, possible options, and indices of correct answers.
 * @param is_randomized - Whether the quiz questions should be randomized.
 * @param timed_quiz - The time limit for the quiz in seconds.
 * @param user_id - The ID of the user creating the quiz.
 * @param isAI - Optional flag indicating if the quiz is AI-generated.
 * @returns The created quiz object from the database.
 * @throws Will throw an error if the quiz creation fails.
 */
export async function createUserQuiz(
  title: string,
  description: string | null,
  quiz_content: {
    question: string;
    description?: string;
    options: string[];
    correctAnswers: number[];
  }[],
  is_randomized: boolean,
  timed_quiz: number,
  user_id: string,
  isAI?: boolean
) {
  return db_client.quiz.create({
    data: {
      title,
      description,
      quiz_content,
      is_randomized,
      timed_quiz,
      user_id,
      is_ai_generated: isAI,
      is_public: true,
    },
  });
}

/**
 * Updates an existing quiz with the provided details.
 *
 * @param title - The title of the quiz.
 * @param description - A brief description of the quiz.
 * @param quiz_content - An array of quiz questions, each containing the question text, optional description, possible options, and indices of correct answers.
 * @param is_randomized - Whether the quiz questions should be presented in a randomized order.
 * @param timed_quiz - The time limit for the quiz in seconds.
 * @param quiz_id - The unique identifier of the quiz to update.
 * @returns A promise that resolves to the updated quiz object.
 * @throws Will throw an error if the update operation fails.
 */
export async function updateUserQuiz(
  title: string,
  description: string | null,
  quiz_content: {
    question: string;
    description?: string;
    options: string[];
    correctAnswers: number[];
  }[],
  is_randomized: boolean,
  timed_quiz: number,
  quiz_id: string,
  user_id: string
) {
  const result = await db_client.quiz.updateMany({
    data: {
      title,
      description,
      quiz_content,
      is_randomized,
      timed_quiz,
    },
    where: {
      id: quiz_id,
      user_id: user_id,
    },
  });

  if (result.count === 0) {
    throw new Error("Quiz not found or user not authorized.");
  }

  return db_client.quiz.findUnique({ where: { id: quiz_id } });
}

/**
 * Updates the visibility status of a quiz for a given quiz ID.
 *
 * @param visibility - A boolean indicating whether the quiz should be public (`true`) or private (`false`).
 * @param quiz_id - The unique identifier of the quiz to update.
 * @returns A promise that resolves to the updated quiz object.
 * @throws Will throw an error if the update operation fails.
 */
export async function updateUserQuizVisibility(
  visibility: boolean,
  quiz_id: string,
  user_id: string
) {
  const result = await db_client.quiz.updateMany({
    data: { is_public: visibility },
    where: {
      id: quiz_id,
      user_id: user_id,
    },
  });

  if (result.count === 0) {
    throw new Error("Quiz not found or user not authorized.");
  }

  return db_client.quiz.findUnique({ where: { id: quiz_id } });
}

/**
 * Deletes a quiz for a user by its unique identifier.
 *
 * @param quiz_id - The unique identifier of the quiz to delete.
 * @returns A promise that resolves to `true` if the quiz was deleted successfully.
 * @throws Will throw an error if the deletion fails.
 */
export async function deleteUserQuiz(quiz_id: string, user_id: string) {
  const result = await db_client.quiz.deleteMany({
    where: {
      id: quiz_id,
      user_id: user_id,
    },
  });

  if (result.count === 0) {
    throw new Error("Quiz not found or user not authorized.");
  }
  return true;
}

/**
 * Submits a quiz attempt by creating a new record in the database.
 *
 * @param answer_data - An object containing the question details and the user's answer.
 * @param answer_data.question - The question object, including the question text, optional description, available options, and correct answer indices.
 * @param answer_data.user_answer - An array of indices representing the user's selected answers.
 * @param started_at - The ISO string representing when the quiz attempt was started.
 * @param completed_at - The ISO string representing when the quiz attempt was completed.
 * @param duration - The duration of the quiz attempt in seconds.
 * @param score - The score achieved by the user in this attempt.
 * @param quiz_id - The unique identifier of the quiz.
 * @param user_id - The unique identifier of the user submitting the attempt.
 * @returns An object indicating successful submission and the ID of the created quiz attempt.
 * @throws Will throw an error if the database operation fails.
 */
export async function submitQuizAttempt(
  answer_data: {
    question: {
      question: string;
      description?: string;
      options: string[];
      correctAnswers: number[];
    };
    user_answer: number[];
  },
  started_at: string,
  completed_at: string,
  duration: number,
  score: number,
  quiz_id: string,
  user_id: string
) {
  try {
    const { id } = await db_client.quizAttempt.create({
      data: {
        user_id,
        started_at,
        completed_at,
        answer_data,
        duration,
        score,
        quiz_id,
        is_public: true,
      },
    });
    return {
      submitted: true,
      id: id,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Retrieves a quiz attempt by its unique identifier.
 *
 * @param attempt_id - The unique identifier of the quiz attempt.
 * @returns A promise that resolves to the quiz attempt object, including related quiz and selected user fields.
 * @throws Rethrows any errors encountered during the database query.
 */
export async function getQuizAttempt(attempt_id: string, user_id: string) {
  const attempt = await db_client.quizAttempt.findFirst({
    where: {
      id: attempt_id,
      user_id: user_id,
    },
    include: {
      quiz: true,
      user: { select: { first_name: true, last_name: true } },
    },
  });

  if (!attempt) {
    throw new Error("Quiz attempt not found or user not authorized.");
  }
  return attempt;
}
