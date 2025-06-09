import db_client from "../../utils/client"

export async function getUser(user_id: string) {
    const user = await db_client.user.findFirst({
        where: { id: user_id }
    })

    return user
}

export async function changeUserName(first_name: string, last_name: string, user_id: string) {
    return db_client.user.update({
        data: {
            first_name: first_name,
            last_name: last_name
        },
        where: {
            id: user_id
        }
    })
}

export async function toggleProfileVisibility(visibility: boolean, user_id: string) {
    return db_client.user.update({
        data: {
            is_public: visibility
        },
        where: {
            id: user_id
        }
    })
}