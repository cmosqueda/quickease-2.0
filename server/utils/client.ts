import { PrismaClient } from "@prisma/client";

/**
 * An instance of PrismaClient used to interact with the database.
 * Provides methods for querying and manipulating data in the application's database.
 *
 * @see {@link https://www.prisma.io/docs/reference/api-reference/prisma-client}
 */
let db_client = new PrismaClient();

export default db_client;
