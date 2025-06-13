import { FastifyInstance } from 'fastify';
import {
    get_user_posts, get_post,
    get_comments, create_post, comment_on_post, vote_on_post,
    reply_on_comment, vote_on_comment, add_tag_on_post,
    delete_post, toggle_post_visibility
} from './post.controller';


export default async function postRoutes(fastify: FastifyInstance) {
    fastify.get('/posts/user', {
        preHandler: [fastify.authenticate],
        handler: get_user_posts
    });

    fastify.post('/posts/view', {
        preHandler: [fastify.authenticate],
        handler: get_post
    });

    fastify.post('/posts/comments', {
        preHandler: [fastify.authenticate],
        handler: get_comments
    });

    fastify.post('/posts', {
        preHandler: [fastify.authenticate],
        handler: create_post
    });

    fastify.post('/posts/comment', {
        preHandler: [fastify.authenticate],
        handler: comment_on_post
    });

    fastify.post('/posts/vote', {
        preHandler: [fastify.authenticate],
        handler: vote_on_post
    });

    fastify.post('/comments/reply', {
        preHandler: [fastify.authenticate],
        handler: reply_on_comment
    });

    fastify.post('/comments/vote', {
        preHandler: [fastify.authenticate],
        handler: vote_on_comment
    });

    fastify.post('/posts/tag', {
        preHandler: [fastify.authenticate],
        handler: add_tag_on_post
    });

    fastify.delete('/posts', {
        preHandler: [fastify.authenticate],
        handler: delete_post
    });

    fastify.put('/posts/visibility', {
        preHandler: [fastify.authenticate],
        handler: toggle_post_visibility
    });
}
