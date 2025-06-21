import db_client from "../../utils/client"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';

export async function getUserPosts(user_id: string) {
    const posts = await db_client.post.findMany({
        where: { user_id: user_id }
    })

    return posts
}

export async function getRecentPosts(cursor?: string | null, limit = 10) {
    const cutoffDate = dayjs.extend(utc).utc().subtract(7, "day").toDate();

    const posts = await db_client.post.findMany({
        where: {
            created_at: {
                gte: cutoffDate,
            },
            is_public: true,
        },
        orderBy: {
            created_at: 'desc',
        },
        include: {
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            },
            votes: {
                select: {
                    vote_type: true,
                }
            },
            comments: {
                select: {
                    parent_comment: true,
                    comment_body: true,
                    replies: true,
                    votes: true,
                    _count: {
                        select: {
                            replies: true,
                        }
                    }
                }
            }
        },
        take: limit + 1,
        ...(cursor
            ? {
                skip: 1,
                cursor: {
                    id: cursor,
                },
            }
            : {}),
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;

    return {
        posts: items,
        nextCursor: hasMore ? items[items.length - 1].id : null,
    };
}


export async function getPost(post_id: string) {
    const post = await db_client.post.findFirst({
        where: { id: post_id },
        include: {
            comments: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            },
        },
    });

    if (!post) return null;

    const [upvotes, downvotes] = await Promise.all([
        db_client.postVote.count({
            where: {
                post_id,
                vote_type: 1,
            },
        }),
        db_client.postVote.count({
            where: {
                post_id,
                vote_type: -1,
            },
        }),
    ]);

    return {
        ...post,
        vote_summary: {
            upvotes,
            downvotes,
        },
    };
}


export async function getComments(post_id: string) {
    const comments = await db_client.comment.findMany({
        where: { post_id: post_id }
    })

    return comments
}

export async function createPost(body: string, title: string, user_id: string) {
    const post = await db_client.post.create({
        data: {
            title: title,
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

export async function togglePostVisibility(visibility: boolean, post_id: string) {
    await db_client.post.update({
        data: {
            is_public: visibility
        },
        where: {
            id: post_id
        }
    })

    return true
}