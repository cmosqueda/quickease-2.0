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
