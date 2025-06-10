import { FastifyRequest, FastifyReply } from "fastify";
import { changeUserName, getUser, toggleProfileVisibility } from "./user.service";


export async function get_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = await getUser(request.user.id);

        if (!user) {
            return reply.code(404).send({ message: "User not found." });
        }

        reply.code(200).send(user);
    } catch (err) {
        reply.code(500).send({ message: "Error getting user's details." });
    }
}

export async function edit_user_name(request: AuthenticatedRequest, reply: FastifyReply) {
    const { firstName, lastName } = request.body as {
        firstName: string;
        lastName: string;
    };

    try {
        const update = await changeUserName(firstName, lastName, request.user.id);
        reply.code(200).send({
            message: "Name updated successfully.",
            user: update,
        });
    } catch (err) {
        reply.code(500).send({ message: "Error updating name." });
    }
}

export async function toggle_user_visibility(request: AuthenticatedRequest, reply: FastifyReply) {
    const { visibility } = request.body as { visibility: boolean };

    try {
        const update = await toggleProfileVisibility(visibility, request.user.id);
        reply.code(200).send({
            message: "Profile visibility updated.",
            user: update,
        });
    } catch (err) {
        reply.code(500).send({ message: "Error updating profile visibility." });
    }
}

// Reserved for future implementation
export async function request_email_change(request: AuthenticatedRequest, reply: FastifyReply) { }
export async function request_change_password(request: AuthenticatedRequest, reply: FastifyReply) { }
export async function change_email(request: AuthenticatedRequest, reply: FastifyReply) { }
