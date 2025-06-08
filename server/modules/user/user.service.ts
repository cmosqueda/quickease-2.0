import { prismaClient } from "../../server";

export async function getUser(user_id: string) {
    const user = await prismaClient.user.findOne({
        where: { user_id },
    })

    return user
}

export async function changeUserName(first_name: string, last_name: string) {
    return prismaClient.user.update({
        data: {
            first_name: first_name,
            last_name: last_name
        }
    })
}