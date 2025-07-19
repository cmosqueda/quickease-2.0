import { PrismaClient } from "../prisma/client";

let db_client = new PrismaClient();

export default db_client;
