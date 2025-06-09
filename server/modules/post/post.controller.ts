import { FastifyReply, FastifyRequest } from "fastify";
import { commentOnPost, createPost, deletePost, getComments, getPost, getUserPosts, replyOnComment, voteOnComment } from "./post.service";

export async function get_user_posts(request: FastifyRequest, reply: FastifyReply) {
    const { user_id } = request.body as { user_id: string }
    try {
        const posts = getUserPosts(user_id)

        reply.code(200).send(posts)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting user posts."
        })
    }
}

export async function get_post(request: FastifyRequest, reply: FastifyReply) {
    const { post_id } = request.body as { post_id: string }
    try {
        const post = getPost(post_id)

        reply.code(200).send(post)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting post."
        })
    }
}

export async function get_comments(request: FastifyRequest, reply: FastifyReply) {
    const { post_id } = request.body as { post_id: string }
    try {
        const comments = getComments(post_id)

        reply.code(200).send(comments)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting comments."
        })
    }
}


export async function create_post(request: FastifyRequest, reply: FastifyReply) {
    const { body, user_id } = request.body as { body: string, user_id: string }
    try {
        const post = createPost(body, user_id)

        reply.code(200).send(post)
    } catch (err) {
        reply.code(500).send({
            message: "Error"
        })
    }
}


export async function comment_on_post(request: FastifyRequest, reply: FastifyReply) {
    const { body, post_id, user_id } = request.body as { body: string, post_id: string, user_id: string }
    try {
        const comment = commentOnPost(body, post_id, user_id)

        reply.code(200).send(comment)
    } catch (err) {
        reply.code(500).send({
            message: "Error"
        })
    }
}

export async function vote_on_post(request: FastifyRequest, reply: FastifyReply) {
    const { } = request.body as {}
    try { } catch (err) {
        reply.code(500).send({
            message: "Error voting on post."
        })
    }
}

export async function vote_on_comment(request: FastifyRequest, reply: FastifyReply) {
    const { vote_type, comment_id, user_id } = request.body as {
        vote_type: number, comment_id: string, user_id: string
    }
    try {
        const vote = voteOnComment(vote_type, comment_id, user_id)

        reply.code(200).send(vote)
    } catch (err) {
        reply.code(500).send({
            message: "Error voting on comment."
        })
    }
}

export async function reply_on_comment(request: FastifyRequest, reply: FastifyReply) {
    const { body, comment_id, user_id, post_id } = request.body as { body: string, comment_id: string, user_id: string, post_id: string }
    try {
        const reply = replyOnComment(body, comment_id, user_id, post_id)

        return reply
    } catch (err) {
        reply.code(500).send({
            message: "Error"
        })
    }
}


export async function delete_post(request: FastifyRequest, reply: FastifyReply) {
    const { post_id } = request.body as { post_id: string }
    try {
        const deleted = deletePost(post_id)

        return deleted
    } catch (err) {
        reply.code(500).send({
            message: "Error"
        })
    }
}