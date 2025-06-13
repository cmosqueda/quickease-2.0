import fastifyCookie from "@fastify/cookie"
import fastifyEnv from "@fastify/env"
import fastifyJwt from "@fastify/jwt"

import { FastifyRequest, FastifyReply } from "fastify"
import { userRoutes } from "./modules/user/user.routes"
import { server } from "./server"
import authRoutes from "./modules/auth/auth.routes"
import flashcardRoutes from "./modules/flashcard/flashcard.route"
import quizRoutes from "./modules/quiz/quiz.routes"
import postRoutes from "./modules/post/post.routes"

export default async function initializeFastifyConfig() {

    /*
    - Configuration for dotenv files
    */
    await server.register(fastifyEnv, {
        data: process.env,
        dotenv: true,
        confKey: 'config',
        schema: {
            type: 'object',
            required: ['JWT_SECRET_KEY', 'COOKIE_SECRET_KEY', 'DATABASE_URL',],
            properties: {
                JWT_SECRET_KEY: { type: 'string' },
                COOKIE_SECRET_KEY: { type: 'string' },
                DATABASE_URL: { type: 'string' },
            }
        }
    })

    /*
    - Configuration for JWT
    */
    await server.register(fastifyJwt, {
        secret: server.config.JWT_SECRET_KEY,
        cookie: {
            cookieName: "QUICKEASE_TOKEN",
            signed: false
        }
    })


    /*
    - Configuration for cookies
    */
    await server.register(fastifyCookie, {
        secret: server.config.COOKIE_SECRET_KEY,
        hook: 'preHandler'
    })



    /*
    - Handler configuration for JWT
    */
    server.addHook('preHandler', (req, res, next) => {
        req.jwt = server.jwt
        return next()
    })

    /*
    - 'onRequest' hook that verifies JWT tokens for every route that requires JWT token 
    The token/cookie is stored on a key named 'QUICKEASE_TOKEN'.
    */
    server.addHook('onRequest', (request) => request.jwtVerify())
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        const token = request.cookies.QUICKEASE_TOKEN

        if (!token) {
            return reply.status(401).send({ message: 'Authentication required' })
        }

        const decoded = request.jwt.verify(token)
        request.user = decoded

    })

    /*
    - Registering routes for each modules
    */
    await server.register(userRoutes, { prefix: 'v1/api/users' })
    await server.register(authRoutes, { prefix: 'v1/api/auth' })
    await server.register(flashcardRoutes, { prefix: 'v1/api/flashcard' })
    await server.register(quizRoutes, { prefix: 'v1/api/quiz' })
    await server.register(postRoutes, { prefix: 'v1/api/post' })


    /*
    - API testing routes
    */
    server.get('/api/test', (req, res) => {
        try {
            res.code(200).send({
                message: "API working."
            })
        } catch (err) {
            res.code(500).send({
                message: "API not working."
            })
        }
    })
}