import db_client from "../../utils/client";

export async function getUserQuizzes(user_id: string) {
    const quizzes = await db_client.quiz.findMany({
        where: {
            user_id: user_id
        }
    })

    return quizzes
}

export async function createUserQuiz(title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }, user_id: string,) {
    const quiz = await db_client.quiz.create({
        data: {
            title,
            description,
            quiz_content,
            user_id
        }
    })

    return quiz
}

export async function updateUserQuiz(title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }, quiz_id: string) {
    const quiz = await db_client.quiz.update({
        data: {
            title, description, quiz_content
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