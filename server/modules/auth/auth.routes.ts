import { FastifyInstance } from "fastify";
import { login_user, register_user, logout } from "./auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
<<<<<<< HEAD
  fastify.post("/login", {
    handler: login_user,
  });

  fastify.post("/register", {
    handler: register_user,
  });

  fastify.post("/logout", {
    preHandler: [fastify.authenticate], // optional: protect logout if needed
    handler: logout,
  });
=======
    fastify.post('/login', {
        handler: login_user
    });

    fastify.post('/register', {
        handler: register_user
    });

    fastify.post('/logout', {
        preHandler: [fastify.authenticate], // optional: protect logout if needed
        handler: logout
    });
>>>>>>> idok/main
}
