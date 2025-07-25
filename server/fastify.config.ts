import fastifyCookie from "@fastify/cookie";
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import cors from "@fastify/cors";

// routes modules
import authRoutes from "./modules/auth/auth.routes";
import flashcardRoutes from "./modules/flashcard/flashcard.route";
import quizRoutes from "./modules/quiz/quiz.routes";
import aiRoutes from "./modules/ai/ai.routes";
import userRoutes from "./modules/user/user.routes";
import forumRoutes from "./modules/post/forum.routes";
import noteRoutes from "./modules/note/note.route";
import mailRoutes from "./modules/mail/mail.route";

import { FastifyRequest, FastifyReply } from "fastify";
import { server } from "./server";

export default async function initializeFastifyConfig() {
  /*
    - Configuration for dotenv files
    */
  await server.register(fastifyEnv, {
    data: process.env,
    dotenv: true,
    confKey: "config",
    schema: {
      type: "object",
      required: [
        "JWT_SECRET_KEY",
        "COOKIE_SECRET_KEY",
        "DATABASE_URL",
        "GOOGLE_GEN_AI_API_KEY",
        "CORS_FRONTEND_HOST",
        "NODEMAILER_GMAIL_APP_PASSWORD",
        "NODEMAILER_GMAIL_USER",
      ],
      properties: {
        JWT_SECRET_KEY: { type: "string" },
        COOKIE_SECRET_KEY: { type: "string" },
        DATABASE_URL: { type: "string" },
        GOOGLE_GEN_AI_API_KEY: { type: "string" },
        CORS_FRONTEND_HOST: { type: "string" },
        NODEMAILER_GMAIL_APP_PASSWORD: { type: "string" },
        NODEMAILER_GMAIL_USER: { type: "string" },
      },
    },
  });

  /*
    - Configuration for cookies
    */
  await server.register(fastifyCookie, {
    secret: server.config.COOKIE_SECRET_KEY,
    hook: "preHandler",
  });

  /*
    - Configuration for JWT
    */
  await server.register(fastifyJwt, {
    secret: server.config.JWT_SECRET_KEY,
    cookie: {
      cookieName: "QUICKEASE_TOKEN",
      signed: false,
    },
  });

  /*
   - Configuration for CORS
   */
  await server.register(cors, {
    origin: process.env.CORS_FRONTEND_HOST,
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["content-type", "accept", "content-type", "authorization"],
  });

  /*
    - Configuration for Multipart (handling files)
    
    Max MB size = 15MB
    Max files length = 5
    */
  await server.register(fastifyMultipart, {
    limits: {
      fileSize: 10485760,
      files: 1,
    },
  });

  /*
    - Handler configuration for JWT
    */
  server.addHook("preHandler", (req, res, next) => {
    req.jwt = server.jwt;
    return next();
  });

  /*
    - 'onRequest' hook that verifies JWT tokens for every route that requires JWT token
    The token/cookie is stored on a key named 'QUICKEASE_TOKEN'.
    */
  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.QUICKEASE_TOKEN;

      if (!token) {
        return reply.status(401).send({ message: "Authentication required" });
      }

      const decoded = request.jwt.verify<{
        id: string;
        first_name: string;
        last_name: string;
      }>(token);

      request.user = decoded;
    }
  );

  /*
    - Registering routes for each modules
    */
  await server.register(userRoutes, { prefix: "api/users" });
  await server.register(authRoutes, { prefix: "api/auth" });
  await server.register(noteRoutes, { prefix: "api/notes" });
  await server.register(flashcardRoutes, { prefix: "api/flashcard" });
  await server.register(quizRoutes, { prefix: "api/quiz" });
  await server.register(forumRoutes, { prefix: "api/forum" });
  await server.register(aiRoutes, { prefix: "api/ai" });
  await server.register(mailRoutes, { prefix: "api/mail" });

  /*
    - API testing routes
    */

  server.get("/api/test", (req, res) => {
    try {
      res.code(200).send({
        message: "API working.",
      });
    } catch (err) {
      res.code(500).send({
        message: "API not working.",
      });
    }
  });
}
