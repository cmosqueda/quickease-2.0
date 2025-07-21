import { FastifyInstance } from "fastify";
import {
  get_user_notes,
  create_user_note,
  update_user_note,
  delete_user_note,
  toggle_user_note_visibility,
  get_user_note,
} from "./note.controller";

export default async function noteRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user_notes,
  });

  fastify.get("/:note_id", {
    preHandler: [fastify.authenticate],
    handler: get_user_note,
  });

  fastify.post("/create", {
    preHandler: [fastify.authenticate],
    handler: create_user_note,
  });

  fastify.put("/update", {
    preHandler: [fastify.authenticate],
    handler: update_user_note,
  });

  fastify.delete("/delete", {
    preHandler: [fastify.authenticate],
    handler: delete_user_note,
  });

  fastify.patch("/toggle-visibility", {
    preHandler: [fastify.authenticate],
    handler: toggle_user_note_visibility,
  });
}
