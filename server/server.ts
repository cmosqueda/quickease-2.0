import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import db_client from "./utils/client";

import { userRoutes } from "./modules/user/user.routes";

const server = Fastify();

server.register(fastifyJwt, {
    secret: "dok",
    cookie: {
        cookieName: "QUICKEASE_TOKEN",
        signed: false
    }
})
server.register(fastifyCookie, {
    secret: 'dok',
    hook: 'preHandler'
})

server.addHook('preHandler', (req, res, next) => {
    req.jwt = server.jwt
    return next()
})

server.addHook('onRequest', (request) => request.jwtVerify())
server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.QUICKEASE_TOKEN

    if (!token) {
        return reply.status(401).send({ message: 'Authentication required' })
    }

    const decoded = request.jwt.verify(token)
    request.user = decoded

})


server.register(userRoutes, { prefix: 'api/users' })


server.get('/healthcheck', (req, res) => {
    res.send({
        status: 200,
        message: "The server is running well."
    })
})

async function main() {
    try {
        await db_client.$connect();
        await server.listen({ port: 3000, host: "0.0.0.0" });

        console.log("Server listening at http://localhost:3000");

    } catch (error) {
        console.error(error);
        process.exit(1);    // exit as failure
    }
}

main();