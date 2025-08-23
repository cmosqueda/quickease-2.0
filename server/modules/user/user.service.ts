import db_client from "../../utils/client";

export async function getUser(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
    include: { flashcards: true, quizzes: true, notes: true },
  });

  return user;
}

export async function checkUser(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
    select: {
      first_name: true,
      last_name: true,
      is_admin: true,
    },
  });

  return user;
}

export async function changeUserName(
  first_name: string,
  last_name: string,
  user_id: string
) {
  return await db_client.user.update({
    data: {
      first_name: first_name,
      last_name: last_name,
    },
    where: {
      id: user_id,
    },
  });
}

export async function changeUserEmail(email: string, user_id: string) {
  return await db_client.user.update({
    data: {
      email: email,
    },
    where: {
      id: user_id,
    },
  });
}

export async function toggleProfileVisibility(
  visibility: boolean,
  user_id: string
) {
  const update = await db_client.user.update({
    data: {
      is_public: visibility,
    },
    where: {
      id: user_id,
    },
  });

  return update;
}

export async function viewProfile(user_id: string) {
  const user = await db_client.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      first_name: true,
      last_name: true,
      comments: true,
      badges: true,
      avatar: true,
      posts: {
        include: { user: true },
        where: { is_resolved: null },
      },
      is_public: true,
    },
  });

  if (user?.is_public) {
    return user;
  } else {
    return {
      first_name: user?.first_name,
      last_name: user?.last_name,
      is_public: false,
    };
  }
}

export async function changeAvatar(avatar_id: string, user_id: string) {
  await db_client.user.update({
    data: {
      avatar: avatar_id,
    },
    where: {
      id: user_id,
    },
  });

  return true;
}
