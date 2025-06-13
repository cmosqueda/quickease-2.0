import { FastifyInstance } from "fastify";
import { edit_user_name, get_user, toggle_user_visibility } from "./user.controller";


export async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        handler: get_user
    });

    fastify.put('edit-name', {
        preHandler: [fastify.authenticate],
        handler: edit_user_name
    });

    fastify.put('visibility', {
        preHandler: [fastify.authenticate],
        handler: toggle_user_visibility
    });
}