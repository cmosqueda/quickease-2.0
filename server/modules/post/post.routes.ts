import { FastifyInstance } from 'fastify';
import {
    get_user_posts, get_post,
    get_comments, create_post, comment_on_post, vote_on_post,
    reply_on_comment, vote_on_comment, add_tag_on_post,
    delete_post, toggle_post_visibility
} from './post.controller';


export default async function postRoutes(fastify: FastifyInstance) {
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        handler: get_user_posts
    });

    fastify.post('/post/view', {
        preHandler: [fastify.authenticate],
        handler: get_post
    });

    fastify.post('/comments/view', {
        preHandler: [fastify.authenticate],
        handler: get_comments
    });

    fastify.post('/post/create', {
        preHandler: [fastify.authenticate],
        handler: create_post
    });

    fastify.post('/comments/comment', {
        preHandler: [fastify.authenticate],
        handler: comment_on_post
    });

    fastify.post('/post/vote', {
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

    fastify.post('/post/tag', {
        preHandler: [fastify.authenticate],
        handler: add_tag_on_post
    });

    fastify.delete('/post/delete', {
        preHandler: [fastify.authenticate],
        handler: delete_post
    });

    fastify.put('/post/toggle-visibility', {
        preHandler: [fastify.authenticate],
        handler: toggle_post_visibility
    });
}
