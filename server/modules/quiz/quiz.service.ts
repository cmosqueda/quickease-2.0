import db_client from "../../utils/client";

export async function getUserQuizzes(user_id: string) {
    try {
        return await db_client.quiz.findMany({ where: { user_id } });
    } catch (err) {
        console.error("getUserQuizzes error:", err);
        throw err;
    }
}

export async function getQuiz(quiz_id: string) {
    try {
        return await db_client.quiz.findUnique({
            where: { id: quiz_id },
            include: { attempts: true }
        });
    } catch (err) {
        console.error("getQuiz error:", err);
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
                is_ai_generated: isAI
            }
        });
    } catch (err) {
        console.error("createUserQuiz error:", err);
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
                timed_quiz
            },
            where: { id: quiz_id }
        });
    } catch (err) {
        console.error("updateUserQuiz error:", err);
        throw err;
    }
}

export async function updateUserQuizVisibility(visibility: boolean, quiz_id: string) {
    try {
        return await db_client.quiz.update({
            data: { is_public: visibility },
            where: { id: quiz_id }
        });
    } catch (err) {
        console.error("updateUserQuizVisibility error:", err);
        throw err;
    }
}

export async function deleteUserQuiz(quiz_id: string) {
    try {
        await db_client.quiz.delete({ where: { id: quiz_id } });
        return true;
    } catch (err) {
        console.error("deleteUserQuiz error:", err);
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
    quiz_id: string,
    user_id: string
) {
    try {
        await db_client.quizAttempt.create({
            data: {
                user_id,
                started_at,
                completed_at,
                answer_data,
                quiz_id
            }
        });
        return true;
    } catch (err) {
        console.error("submitQuizAttempt error:", err);
        throw err;
    }
}

export async function getQuizAttempt(attempt_id: string) {
    try {
        return await db_client.quizAttempt.findUnique({
            where: { id: attempt_id }
        });
    } catch (err) {
        console.error("getQuizAttempt error:", err);
        throw err;
    }
}
