import Fastify from "fastify";
import db_client from "./utils/client";
import initializeFastifyConfig from "./fastify.config";

export const server = Fastify();

async function main() {
  try {
    await initializeFastifyConfig();
    await db_client.$connect();
    await server.listen({ port: 10000, host: "0.0.0.0" });

    console.log("Server listening at http://localhost:3000");
    console.log(server.getEnvs());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
