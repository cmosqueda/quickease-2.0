import bcrypt from "bcrypt";
import db_client from "./client";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  return hash;
}

export async function verifyPassword(email: string, password: string) {
  const user = await db_client.user.findUnique({
    where: {
      email: email,
    },
  });

<<<<<<< HEAD
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!user || !isMatch) {
    return false;
  }
=======
    const isMatch = user && (await bcrypt.compare(password, password))
    if (!user || !isMatch) {
        return false
    }
>>>>>>> idok/main

  return true;
}
