import { JWT } from "@fastify/jwt";

// for building comment tree
export type FlatComment = {
  id: string;
  comment_body: string;
  created_at: Date;
  parent_comment_id: string | null;
  post_id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  votes: {
    vote_type: number;
    user_id: string;
  }[];
};

export type NestedComment = FlatComment & {
  replies: NestedComment[];
  vote_sum: number;
  user_vote: number;
};
// for building comment tree

/**
 * Extends the `@fastify/jwt` module to define custom types for JWT payload and user objects.
 *
 * @interface FastifyJWT
 * @property {object} payload - The JWT payload containing user information.
 * @property {string} payload.id - The unique identifier for the user.
 * @property {string} payload.first_name - The user's first name.
 * @property {string} payload.last_name - The user's last name.
 * @property {boolean} payload.is_admin - Indicates if the user has administrative privileges.
 * @property {object} user - The user object extracted from the JWT.
 * @property {string} user.id - The unique identifier for the user.
 * @property {string} user.first_name - The user's first name.
 * @property {string} user.last_name - The user's last name.
 * @property {boolean} user.is_admin - Indicates if the user has administrative privileges.
 * @property {any} [key: string] - Allows additional properties for both payload and user objects.
 */
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      [key: string]: any;
    };
    user: {
      id: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      [key: string]: any;
    };
  }
}

/**
 * Module augmentation for "fastify" to extend FastifyRequest and FastifyInstance interfaces.
 *
 * @remarks
 * - Adds a `jwt` property of type `JWT` to `FastifyRequest`.
 * - Adds `authenticate` and `authenticate_admin` methods to `FastifyInstance`.
 * - Adds a `config` object to `FastifyInstance` containing environment-specific keys.
 *
 * @property {JWT} FastifyRequest.jwt - The JWT payload attached to the request.
 * @property {any} FastifyInstance.authenticate - Middleware for user authentication.
 * @property {any} FastifyInstance.authenticate_admin - Middleware for admin authentication.
 * @property {object} FastifyInstance.config - Configuration object containing secrets and API keys.
 * @property {string} FastifyInstance.config.JWT_SECRET_KEY - Secret key for JWT signing.
 * @property {string} FastifyInstance.config.COOKIE_SECRET_KEY - Secret key for cookies.
 * @property {string} FastifyInstance.config.DATABASE_URL - Database connection URL.
 * @property {string} FastifyInstance.config.GOOGLE_GEN_AI_API_KEY - API key for Google Gen AI.
 */
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }

  interface FastifyInstance {
    authenticate: any;
    authenticate_admin: any;
    config: {
      JWT_SECRET_KEY: string;
      COOKIE_SECRET_KEY: string;
      DATABASE_URL: string;
      GOOGLE_GEN_AI_API_KEY: string;
    };
  }
}
