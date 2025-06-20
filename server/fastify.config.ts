import fastifyCookie from "@fastify/cookie"
import fastifyEnv from "@fastify/env"
import fastifyJwt from "@fastify/jwt"
import fastifyMultipart from "@fastify/multipart"
import cors from "@fastify/cors"

// routes modules
import authRoutes from "./modules/auth/auth.routes"
import flashcardRoutes from "./modules/flashcard/flashcard.route"
import quizRoutes from "./modules/quiz/quiz.routes"
import postRoutes from "./modules/post/post.routes"
import aiRoutes from "./modules/ai/ai.routes"
import userRoutes from "./modules/user/user.routes"

import { FastifyRequest, FastifyReply } from "fastify"
import { server } from "./server"
import { noteRoutes } from "./modules/note/note.route"

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
            required: ['JWT_SECRET_KEY', 'COOKIE_SECRET_KEY', 'DATABASE_URL', 'GOOGLE_GEN_AI_API_KEY'],
            properties: {
                JWT_SECRET_KEY: { type: 'string' },
                COOKIE_SECRET_KEY: { type: 'string' },
                DATABASE_URL: { type: 'string' },
                GOOGLE_GEN_AI_API_KEY: { type: 'string' }
            }
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
   - Configuration for CORS
   */
    await server.register(cors, {
        origin: process.env.CORS_FRONTEND_HOST,
        credentials: true
    })

    /*
    - Configuration for Multipart (handling files)
    
    Max MB size = 15MB
    Max files length = 5

    */
    await server.register(fastifyMultipart, {
        limits: {
            fileSize: 15728640,
            files: 5,
        }
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
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        const token = request.cookies.QUICKEASE_TOKEN

        if (!token) {
            return reply.status(401).send({ message: 'Authentication required' })
        }

        const decoded = request.jwt.verify<{
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            phone_number: string;
            is_public: boolean
            [key: string]: any;
        }>(token)

        request.user = decoded
    })

    /*
    - Registering routes for each modules
    */
    await server.register(userRoutes, { prefix: 'api/users' })
    await server.register(authRoutes, { prefix: 'api/auth' })
    await server.register(noteRoutes, { prefix: 'api/notes' })
    await server.register(flashcardRoutes, { prefix: 'api/flashcard' })
    await server.register(quizRoutes, { prefix: 'api/quiz' })
    await server.register(postRoutes, { prefix: 'api/forum' })
    await server.register(aiRoutes, { prefix: 'api/ai' })


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