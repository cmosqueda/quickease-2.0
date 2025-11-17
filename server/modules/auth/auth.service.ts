import db_client from "../../utils/client";
import bcrypt from "bcrypt";

import { hashPassword } from "../../utils/hash";

/**
 * Attempts to log in a user with the provided email and password.
 *
 * Finds the user by email, verifies the password using bcrypt, and returns the user object if authentication succeeds.
 *
 * @param email - The email address of the user attempting to log in.
 * @param password - The plaintext password provided by the user.
 * @returns The user object if authentication is successful; otherwise, returns false.
 * @throws {Error} If there is an error during the login process.
 */
export async function loginUser(email: string, password: string) {
  try {
    const user = await db_client.user.findUnique({
      where: { email },
    });

    if (!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;

    return {
      ...user,
      password:
        "nope, contact me nalang kay na-decode nimo ang JWT. hehe jhon lloyd viernes akong name",
    };
  } catch (err) {
    throw new Error("User login failed.");
  }
}

/**
 * Registers a new user with the provided details.
 *
 * Hashes the password before storing the user in the database.
 * Throws an error if registration fails.
 *
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param email - The email address of the user.
 * @param password - The plain text password of the user.
 * @returns The created user object.
 * @throws Error if user registration fails.
 */
export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    const hashed = await hashPassword(password);

    const user = await db_client.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashed,
      },
    });

    return {
      ...user,
      password:
        "nope, contact me nalang kay na-decode nimo ang JWT. hehe jhon lloyd viernes akong name",
    };
  } catch (err) {
    throw new Error("User registration failed");
  }
}

/**
 * Updates a user's email address using a provided token.
 *
 * This function verifies the token for changing email, ensures it is valid,
 * unused, and not expired, and that it belongs to the user with the specified email.
 * If valid, it marks the token as used and updates the user's email in a transaction.
 *
 * @param email - The current email address of the user.
 * @param token - The token used to authorize the email change.
 * @param new_email - The new email address to update for the user.
 * @returns A promise that resolves to `true` if the email was successfully updated.
 * @throws Error if the token is invalid, expired, or if the update fails.
 */
export async function updateEmail(
  email: string,
  token: string,
  new_email: string
) {
  try {
    const userToken = await db_client.userToken.findFirst({
      where: {
        token,
        type: "CHANGE_EMAIL",
        used: false,
        expires_at: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!userToken || userToken.user.email !== email) {
      throw new Error("Invalid or expired token");
    }

    await db_client.$transaction([
      db_client.userToken.update({
        where: { id: userToken.id },
        data: { used: true },
      }),
      db_client.user.update({
        where: { id: userToken.user.id },
        data: { email: new_email },
      }),
    ]);

    return true;
  } catch (err) {
    throw new Error("Invalid token or failed password update.");
  }
}

/**
 * Updates a user's password using a reset token.
 *
 * This function verifies the provided reset token and email, hashes the new password,
 * marks the token as used, and updates the user's password in a single transaction.
 *
 * @param email - The email address of the user requesting the password reset.
 * @param token - The reset token provided to the user.
 * @param new_password - The new password to set for the user.
 * @returns A promise that resolves to `true` if the password was successfully updated.
 * @throws {Error} If the token is invalid, expired, or the password update fails.
 */
export async function updatePassword(
  email: string,
  token: string,
  new_password: string
) {
  try {
    const userToken = await db_client.userToken.findFirst({
      where: {
        token,
        type: "RESET_PASSWORD",
        used: false,
        expires_at: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!userToken || userToken.user.email !== email) {
      throw new Error("Invalid or expired token");
    }

    const hashedNewPassword = await hashPassword(new_password);

    await db_client.$transaction([
      db_client.userToken.update({
        where: { id: userToken.id },
        data: { used: true },
      }),
      db_client.user.update({
        where: { id: userToken.user.id },
        data: { password: hashedNewPassword },
      }),
    ]);

    return true;
  } catch (err) {
    throw new Error("Invalid token or failed password update.");
  }
}

/**
 * Verifies a user's email address using a provided token.
 *
 * This function checks if the token exists, is of type "VERIFY_EMAIL", has not been used,
 * and has not expired. It also ensures the token is associated with the given email.
 * If verification succeeds, it marks the token as used and updates the user's verification status.
 *
 * @param email - The email address to verify.
 * @param token - The verification token sent to the user's email.
 * @returns A promise that resolves to `true` if verification is successful.
 * @throws {Error} If the token is invalid, expired, or verification fails.
 */
export async function verifyEmail(email: string, token: string) {
  try {
    const userToken = await db_client.userToken.findFirst({
      where: {
        token,
        type: "VERIFY_EMAIL",
        used: false,
        expires_at: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!userToken || userToken.user.email !== email) {
      throw new Error("Invalid or expired token");
    }

    await db_client.$transaction([
      db_client.userToken.update({
        where: { id: userToken.id },
        data: { used: true },
      }),
      db_client.user.update({
        where: { id: userToken.user.id },
        data: { is_verified: true },
      }),
    ]);

    return true;
  } catch (err) {
    throw new Error("Invalid token or verification failed.");
  }
}
