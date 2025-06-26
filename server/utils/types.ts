import { JWT } from '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      is_public: boolean
      [key: string]: any;
    }
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      [key: string]: any;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
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