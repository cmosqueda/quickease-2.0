import { JWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }

  interface FastifyInstance {
    authenticate: any
    config: {
      JWT_SECRET_KEY: string
      COOKIE_SECRET_KEY: string
      DATABASE_URL: string
      GOOGLE_GEN_AI_API_KEY: string
    }
  }
}