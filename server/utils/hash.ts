import bcrypt from "bcrypt";
import db_client from "./client";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  return hash;
}

/**
 * Verifies if the provided password matches the stored password for the user with the given email.
 *
 * @param email - The email address of the user whose password is to be verified.
 * @param password - The plain text password to verify against the stored hash.
 * @returns A promise that resolves to `true` if the password matches, or `false` otherwise.
 */
export async function verifyPassword(email: string, password: string) {
  const user = await db_client.user.findUnique({
    where: {
      email: email,
    },
  });

  const isMatch = user && (await bcrypt.compare(user.password, password));
  if (!user || !isMatch) {
    return false;
  }

  return true;
}
