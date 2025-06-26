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

<<<<<<< HEAD
    return user;
  } catch (err) {
    console.error("loginUser error:", err);
    return false;
  }
=======
        return user;
    } catch (err) {
        return false;
    }
>>>>>>> upstream/main
}

export async function registerUser(firstName: string, lastName: string, email: string, password: string) {
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

<<<<<<< HEAD
    return user;
  } catch (err) {
    console.error("registerUser error:", err);
    throw new Error("User registration failed");
  }
=======
        return user;
    } catch (err) {
        throw new Error("User registration failed");
    }
>>>>>>> upstream/main
}
