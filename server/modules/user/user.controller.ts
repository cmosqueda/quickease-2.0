import { FastifyRequest, FastifyReply } from "fastify";
import { changeUserName, getUser, toggleProfileVisibility } from "./user.service";

export async function get_user(request: FastifyRequest, reply: FastifyReply) {
    const { user_id } = request.body as {
        user_id: string
    }

    try {
        const user = await getUser(user_id);
        reply.code(201).send(user)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting user's details.",
        })
    }
}

export async function request_email_change(request: FastifyRequest, reply: FastifyReply) { }

export async function request_change_password(request: FastifyRequest, reply: FastifyReply) { }

export async function change_email(request: FastifyRequest, reply: FastifyReply) { }

export async function edit_user_name(request: FastifyRequest, reply: FastifyReply) {
    const { firstName, lastName, user_id } = request.body as {
        firstName: string;
        lastName: string;
        user_id: string;
    }

    try {
        const update = changeUserName(firstName, lastName, user_id)
        reply.code(200).send({
            message: "Name updated successfully.",
            update
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error updating name."
        })
    }
}

export async function toggle_user_visibility(request: FastifyRequest, reply: FastifyReply) {
    const { visibility, user_id } = request.body as {
        visibility: boolean;
        user_id: string;
    }

    try {
        const update = toggleProfileVisibility(visibility, user_id)
        reply.send(200).send(update)
    } catch (err) {
        reply.send(500).send({
            message: "Error updating profile visibility."
        })
    }
}