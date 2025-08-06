import db_client from "../../utils/client";

import { hashPassword } from "../../utils/hash";

export async function getUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db_client.user.findMany({
      skip,
      take: limit,
      where: {
        is_admin: false,
      },
    }),
    db_client.user.count({
      where: {
        is_admin: false,
      },
    }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUser(user_id: string) {
  const user = await db_client.user.findFirst({
    where: {
      id: user_id,
    },
  });

  return user;
}

export async function searchUsers(query: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db_client.user.findMany({
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
      skip,
      take: limit,
    }),

    db_client.user.count({
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
    }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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
