import db_client from "../../utils/client";
import { hashPassword } from "../../utils/hash";

export async function getUsers() {
  const users = await db_client.user.findMany({
    where: {
      is_admin: false,
    },
  });

  return users;
}

export async function getUser(user_id: string) {
  const user = await db_client.user.findFirst({
    where: {
      id: user_id,
    },
  });

  return user;
}

export async function searchUsers(query: string) {
  const users = await db_client.user.findMany({
    where: {
      is_admin: false,
      OR: [
        {
          first_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          last_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      is_verified: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return users;
}

export async function updateUserEmail(new_email: string, user_id: string) {
  await db_client.user.update({
    data: {
      email: new_email,
      updated_at: new Date(),
    },
    where: {
      id: user_id,
    },
  });

  return true;
}

export async function updateUserPassword(
  new_password: string,
  user_id: string
) {
  const hashedNewPassword = await hashPassword(new_password);

  await db_client.user.update({
    data: {
      password: hashedNewPassword,
      updated_at: new Date(),
    },
    where: {
      id: user_id,
    },
  });
}

export async function updateUserFullName(
  first_name: string,
  last_name: string,
  user_id: string
) {
  await db_client.user.update({
    data: {
      first_name,
      last_name,
      updated_at: new Date(),
    },
    where: {
      id: user_id,
    },
  });
}

export async function updateUserVisibility(
  visibility: boolean,
  user_id: string
) {
  await db_client.user.update({
    data: {
      is_public: visibility,
    },
    where: {
      id: user_id,
    },
  });
}

export async function deleteUser(user_id: string) {
  await db_client.user.delete({
    where: {
      id: user_id,
    },
  });
}
