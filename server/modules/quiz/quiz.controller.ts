import { FastifyRequest, FastifyReply } from "fastify";
import { createUserQuiz, deleteUserQuiz, getQuiz, getUserQuizzes, submitQuizAttempt, updateUserQuiz, updateUserQuizVisibility } from "./quiz.service";

export async function get_user_quizzes(request: FastifyRequest, reply: FastifyReply) {
    try {
        const quizzes = await getUserQuizzes(request.user.id)

        reply.code(200).send(quizzes)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting user quizzes."
        })
    }
}

export async function get_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { quiz_id } = request.params as { quiz_id: string }

    try {
        const quiz = await getQuiz(quiz_id)

        return quiz
    } catch (err) {
        reply.code(500).send({
            message: "Error getting quiz."
        })
    }
}

export async function create_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, quiz_content, is_randomized, timed_quiz } = request.body as { title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }[], is_randomized: boolean, timed_quiz: number }
    try {
        const quiz = createUserQuiz(title, description, quiz_content, is_randomized, timed_quiz, request.user.id)

        reply.code(200).send(quiz)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating quiz."
        })
    }
}

export async function update_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, quiz_content, is_randomized, timed_quiz, quiz_id } = request.body as { title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }[], is_randomized: boolean, timed_quiz: number, quiz_id: string }
    try {
        await updateUserQuiz(title, description, quiz_content, is_randomized, timed_quiz, quiz_id)

        reply.code(200).send({
            message: "Updated quiz."
        })

    } catch (err) {
        reply.code(500).send({
            message: "Error updating quiz."
        })
    }
}

export async function update_user_quiz_visibility(request: FastifyRequest, reply: FastifyReply) {
    const { visibility, quiz_id } = request.body as { visibility: boolean; quiz_id: string }
    try {
        await updateUserQuizVisibility(visibility, quiz_id)

        reply.code(200).send({
            message: "Updated quiz visibility."
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error updating quiz visibility."
        })
    }
}

export async function delete_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { quiz_id } = request.body as { quiz_id: string }
    try {
        await deleteUserQuiz(quiz_id)

        reply.code(200).send({
            message: "Deleted quiz."
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error deleting quiz."
        })
    }
}

export async function submit_quiz_attempt(request: FastifyRequest, reply: FastifyReply) {
    const { answer_data, started_at, completed_at, quiz_id } = request.body as {
        answer_data: {
            question: {
                question: string;
                description?: string;
                options: string[];
                correctAnswers: number[];
            },
            user_answer: number[];
        }, started_at: string, completed_at: string, quiz_id: string
    }

    try {
        await submitQuizAttempt(answer_data, started_at, completed_at, quiz_id, request.user.id)

        reply.code(200).send({
            submitted: true
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error submitting attempt."
        })
    }

}

