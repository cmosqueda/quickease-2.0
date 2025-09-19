import Fastify from "fastify";
import db_client from "./utils/client";
import initializeFastifyConfig from "./fastify.config";

export const server = Fastify();

/**
 * Initializes the Fastify server configuration, connects to the database,
 * and starts the server listening on the specified port and host.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the server has started successfully.
 */
async function main() {
  try {
    await initializeFastifyConfig();
    await db_client.$connect();
    await server.listen({ port: 10000, host: "0.0.0.0" });

    console.log(server.getEnvs());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
