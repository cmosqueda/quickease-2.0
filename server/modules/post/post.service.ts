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

export async function voteOnPost(vote_type: number, post_id: string, user_id: string) {
    await db_client.postVote.upsert({
        where: {
            user_id_post_id: { user_id, post_id },
        },
        update: { vote_type },
        create: { user_id, post_id, vote_type },
    });

    return { voted: true }
}

export async function voteOnComment(vote_type: number, comment_id: string, user_id: string) {
    await db_client.commentVote.upsert({
        where: {
            user_id_comment_id: { user_id, comment_id },
        },
        update: { vote_type },
        create: { user_id, comment_id, vote_type },
    });

    return { voted: true }
}

export async function addTagOnPost(post_id: string, tag_ids: string[]) {
    const postTags = await Promise.all(
        tag_ids.map(tag_id => db_client.postTag.upsert({
            where: { tag_id_post_id: { tag_id, post_id } },
            update: {},
            create: { tag_id, post_id },
        }))
    );

    return postTags
}

export async function deletePost(post_id: string) {
    await db_client.post.delete({
        where: { id: post_id }
    })

    return { deleted: true }
}