import db_client from "../../utils/client";
import bcrypt from "bcrypt";

import { hashPassword } from "../../utils/hash";

export async function loginUser(email: string, password: string) {
  try {
    const user = await db_client.user.findUnique({
      where: { email },
    });

    if (!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;

    return user;
  } catch (err) {
    throw new Error("User login failed.");
  }
}

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

    return user;
  } catch (err) {
    throw new Error("User registration failed");
  }
}

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
