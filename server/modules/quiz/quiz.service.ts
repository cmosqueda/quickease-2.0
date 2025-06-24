import db_client from "../../utils/client";

export async function getUserQuizzes(user_id: string) {
    const quizzes = await db_client.quiz.findMany({
        where: {
            user_id: user_id
        }
    })

    return quizzes
}

export async function getQuiz(quiz_id: string) {
    const quiz = await db_client.quiz.findUnique({
        where: {
            id: quiz_id
        },
        include: {
            attempts: true
        }
    })

    return quiz
}

export async function createUserQuiz(title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }[], is_randomized: boolean, timed_quiz: number, user_id: string,) {
    const quiz = await db_client.quiz.create({
        data: {
            title,
            description,
            quiz_content,
            is_randomized,
            timed_quiz,
            user_id
        }
    })

    return quiz
}

export async function updateUserQuiz(title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }[], is_randomized: boolean, timed_quiz: number, quiz_id: string) {
    const quiz = await db_client.quiz.update({
        data: {
            title, description, quiz_content, is_randomized, timed_quiz
        },
        where: { id: quiz_id }
    })

    return quiz
}

export async function updateUserQuizVisibility(visibility: boolean, quiz_id: string) {
    const quiz = await db_client.quiz.update({
        data: {
            is_public: visibility
        },
        where: { id: quiz_id }
    })

    return quiz
}

export async function deleteUserQuiz(quiz_id: string) {
    await db_client.quiz.delete({
        where: { id: quiz_id }
    })

    return true
}

export async function submitQuizAttempt(answer_data: {
    question: {
        question: string;
        description?: string;
        options: string[];
        correctAnswers: number[];
    },
    user_answer: number[];
}, started_at: string, completed_at: string, quiz_id: string, user_id: string) {

    await db_client.quizAttempt.create({
        data: {
            user_id,
            started_at,
            completed_at,
            answer_data,
            quiz_id
        }
    })

    return true
}

export async function getQuizAttempt(quiz_id: string) {
    const attempt = await db_client.quizAttempt.findUnique({
        where: {
            id: quiz_id
        }
    })

    return attempt
}