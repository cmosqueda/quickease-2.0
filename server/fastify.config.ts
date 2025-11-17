// plugins
import fastifyCookie from "@fastify/cookie";
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import cors from "@fastify/cors";

// users routes
import authRoutes from "./modules/auth/auth.routes";
import flashcardRoutes from "./modules/flashcard/flashcard.route";
import quizRoutes from "./modules/quiz/quiz.routes";
import aiRoutes from "./modules/ai/ai.routes";
import userRoutes from "./modules/user/user.routes";
import forumRoutes from "./modules/forum/forum.routes";
import noteRoutes from "./modules/note/note.route";
import mailRoutes from "./modules/mail/mail.route";
import notificationRoutes from "./modules/notification/notification.route";
import badgeRoutes from "./modules/badges/badges.route";

// admin routes
import adminAuthRoutes from "./modules/admin/admin.auth.route";
import adminForumRoutes from "./modules/admin/admin.forum.route";
import adminMailRoutes from "./modules/admin/admin.mail.route";

import { FastifyRequest, FastifyReply } from "fastify";
import { server } from "./server";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";

/**
 * Initializes Fastify server configuration including environment variables, cookies, JWT, CORS, multipart handling, and route registration.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when all configurations and routes are registered.
 *
 * @remarks
 * - Loads environment variables using `fastifyEnv` and validates required keys.
 * - Registers cookie handling with secret from environment.
 * - Configures JWT authentication with cookie support and expiration.
 * - Sets up CORS with a whitelist of allowed origins and credentials.
 * - Enables multipart file uploads with size and file count limits.
 * - Adds hooks for JWT handling and authentication, including admin-only access.
 * - Registers API routes for users, authentication, notes, flashcards, quizzes, forums, AI, mail, notifications, badges, and admin modules.
 * - Provides a test route for API health checking.
 *
 * @throws {Error} Throws if environment validation fails or registration of plugins/routes encounters an error.
 */
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

  await server.register(fastifyHelmet);
  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
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
    sign: {
      expiresIn: "1d",
    },
    cookie: {
      cookieName: "QUICKEASE_TOKEN",
      signed: true,
    },
  });

  /*
   - Configuration for CORS
   */
  await server.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = [
        process.env.CORS_FRONTEND_HOST,
        "https://quickease.online",
        "https://www.quickease.online",
        "https://quickease-eight.vercel.app",
        "http://localhost:5173", // Vite Development Port
        "http://localhost:19006", // Expo Web Dev
        "http://127.0.0.1:19006", // Alternate localhost
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
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

  function createAuthGuard(options: { isAdmin: boolean }) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.QUICKEASE_TOKEN;

      if (!token) {
        return reply.code(401).send({ message: "authentication_required" });
      }

      try {
        const decoded = request.jwt.verify(token) as {
          id: string;
          first_name: string;
          last_name: string;
          is_admin: boolean;
        };

        if (
          !decoded.id ||
          !decoded.first_name ||
          !decoded.last_name ||
          typeof decoded.is_admin !== "boolean"
        ) {
          return reply.code(401).send({ message: "invalid_token_payload" });
        }

        request.user = decoded;

        if (options.isAdmin && !decoded.is_admin) {
          return reply.code(403).send({ message: "admin_only_access" });
        }
      } catch (err) {
        return reply.code(401).send({ message: "invalid_token" });
      }
    };
  }

  /*
    - 'onRequest' hook that verifies JWT tokens for every route that requires JWT token
    The token/cookie is stored on a key named 'QUICKEASE_TOKEN'.
    */

  server.decorate("authenticate", createAuthGuard({ isAdmin: false }));
  /*
    - 'onRequest' hook that verifies JWT tokens for every route that requires JWT token
    The token/cookie is stored on a key named 'QUICKEASE_TOKEN'.

    (FOR ADMIN API ROUTES)
    */
  server.decorate("authenticate_admin", createAuthGuard({ isAdmin: true }));

  /*
    - Registering routes for each modules (Users)
    */
  await server.register(userRoutes, { prefix: "api/users" });
  await server.register(authRoutes, { prefix: "api/auth" });
  await server.register(noteRoutes, { prefix: "api/notes" });
  await server.register(flashcardRoutes, { prefix: "api/flashcard" });
  await server.register(quizRoutes, { prefix: "api/quiz" });
  await server.register(forumRoutes, { prefix: "api/forum" });
  await server.register(aiRoutes, { prefix: "api/ai" });
  await server.register(mailRoutes, { prefix: "api/mail" });
  await server.register(notificationRoutes, { prefix: "api/notifications" });
  await server.register(badgeRoutes, { prefix: "api/badges" });

  /*
    - Registering routes for each modules (Admin)
    */
  await server.register(adminAuthRoutes, { prefix: "api/admin/auth" });
  await server.register(adminForumRoutes, { prefix: "api/admin/forum" });
  await server.register(adminMailRoutes, { prefix: "api/admin/mail" });

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
