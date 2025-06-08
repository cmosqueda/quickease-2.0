import { FastifyInstance } from "fastify";
import { get_user } from "./user.controller";


export async function userRoutes(fastify: FastifyInstance) {
    // Route for getting user
    fastify.get('/user/:user_id', get_user)

    // Route for changing user's name

}