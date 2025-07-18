import db_client from "../../utils/client";

export async function getUserQuizzes(user_id: string) {
  try {
    return await db_client.quiz.findMany({ where: { user_id } });
  } catch (err) {
    throw err;
  }
}

export async function getQuiz(quiz_id: string, user_id: string) {
  try {
    // Fetch the quiz and the current user's attempts
    const quiz = await db_client.quiz.findUnique({
      where: { id: quiz_id },
      include: {
        attempts: {
          where: { user_id },
        },
      },
    });

    const leaderboard = await db_client.quizAttempt.findMany({
      where: {
        quiz_id,
        is_public: true,
      },
      orderBy: [
        { score: "desc" },
        {
          duration: "asc",
        },
      ],
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return { ...quiz, leaderboard };
  } catch (err) {
    throw err;
  }
}

export async function createUserQuiz(
  title: string,
  description: string,
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
  try {
    return await db_client.quiz.create({
      data: {
        title,
        description,
        quiz_content,
        is_randomized,
        timed_quiz,
        user_id,
        is_ai_generated: isAI,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function updateUserQuiz(
  title: string,
  description: string,
  quiz_content: {
    question: string;
    description?: string;
    options: string[];
    correctAnswers: number[];
  }[],
  is_randomized: boolean,
  timed_quiz: number,
  quiz_id: string
) {
  try {
    return await db_client.quiz.update({
      data: {
        title,
        description,
        quiz_content,
        is_randomized,
        timed_quiz,
      },
      where: { id: quiz_id },
    });
  } catch (err) {
    throw err;
  }
}

export async function updateUserQuizVisibility(
  visibility: boolean,
  quiz_id: string
) {
  try {
    return await db_client.quiz.update({
      data: { is_public: visibility },
      where: { id: quiz_id },
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteUserQuiz(quiz_id: string) {
  try {
    await db_client.quiz.delete({ where: { id: quiz_id } });
    return true;
  } catch (err) {
    throw err;
  }
}

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

export async function getQuizAttempt(attempt_id: string) {
  try {
    return await db_client.quizAttempt.findUnique({
      where: { id: attempt_id },
      include: {
        quiz: true,
        user: { select: { first_name: true, last_name: true } },
      },
    });
  } catch (err) {
    throw err;
  }
}
