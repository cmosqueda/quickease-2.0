import db_client from "../../utils/client"

export async function getUserPosts(user_id: string) {
    const posts = await db_client.post.findMany({
        where: { user_id: user_id }
    })

    return posts
}

export async function getPost(post_id: string) {
    const post = await db_client.post.findFirst({
        where: { id: post_id },
        include: { comments: { where: { post_id: post_id } } }
    })

    return post
}

export async function getComments(post_id: string) {
    const comments = await db_client.comment.findMany({
        where: { post_id: post_id }
    })

    return comments
}

export async function createPost(body: string, user_id: string) {
    const post = await db_client.post.create({
        data: {
            post_body: body,
            user_id: user_id
        }
    })

    return post
}

export async function commentOnPost(body: string, post_id: string, user_id: string) {
    const comment = await db_client.comment.create({
        data: {
            comment_body: body,
            post_id,
            user_id
        }
    })

    await db_client.post.update({
        data: {
            comments: {
                create: comment
            }
        },
        where: { id: post_id }
    })

    return comment
}

export async function replyOnComment(body: string, comment_id: string, user_id: string, post_id: string) {
    await db_client.comment.update({
        data: {
            replies: {
                create: {
                    comment_body: body,
                    user_id: user_id,
                    post_id: post_id
                }
            }
        },
        where: {
            id: comment_id
        }
    })

    return { replied: true }
}

export async function deletePost(post_id: string) {
    await db_client.post.delete({
        where: { id: post_id }
    })

    return { deleted: true }
}