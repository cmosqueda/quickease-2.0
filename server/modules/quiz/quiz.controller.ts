import { FastifyRequest, FastifyReply } from "fastify";
import { createUserQuiz, deleteUserQuiz, getUserQuizzes, updateUserQuiz, updateUserQuizVisibility } from "./quiz.service";

export async function get_user_quizzes(request: FastifyRequest, reply: FastifyReply) {
    try {
        const quizzes = getUserQuizzes(request.user.id)

        reply.code(200).send(quizzes)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting user quizzes."
        })
    }
}

export async function create_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, quiz_content } = request.body as { title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number } }
    try {
        const quiz = createUserQuiz(title, description, quiz_content, request.user.id)

        reply.code(200).send(quiz)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating quiz."
        })
    }
}

export async function update_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, quiz_content, quiz_id } = request.body as { title: string, description: string, quiz_content: { answers: string[], question: string, correct_answer_index: number }, quiz_id: string }
    try {
        await updateUserQuiz(title, description, quiz_content, quiz_id)

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

