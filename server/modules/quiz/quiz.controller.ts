import { FastifyRequest, FastifyReply } from "fastify";

export async function get_user_quizzes(request: FastifyRequest, reply: FastifyReply) {
    const { } = request.body as {}
    try { } catch (err) {
        reply.code(500).send({
            message: "Error getting user quizzes."
        })
    }
}

export async function create_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { } = request.body as {}
    try { } catch (err) {
        reply.code(500).send({
            message: "Error creating quiz."
        })
    }
}

export async function update_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { } = request.body as {}
    try { } catch (err) {
        reply.code(500).send({
            message: "Error updating quiz."
        })
    }
}

export async function update_user_quiz_visibility(request: FastifyRequest, reply: FastifyReply) {
    const { } = request.body as {}
    try { } catch (err) {
        reply.code(500).send({
            message: "Error updating quiz visibility."
        })
    }
}

export async function delete_user_quiz(request: FastifyRequest, reply: FastifyReply) {
    const { } = request.body as {}
    try { } catch (err) {
        reply.code(500).send({
            message: "Error deleting quiz."
        })
    }
}

