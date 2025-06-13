import { FastifyInstance } from 'fastify';
import {
    get_user_flashcards, create_user_flashcard,
    update_user_flashcard, delete_user_flashcard,
    toggle_flashcard_visibility
} from './flashcard.controller';


export default async function flashcardRoutes(fastify: FastifyInstance) {
    fastify.get('/flashcards/user', {
        preHandler: [fastify.authenticate],
        handler: get_user_flashcards
    });

    fastify.post('/flashcards', {
        preHandler: [fastify.authenticate],
        handler: create_user_flashcard
    });

    fastify.put('/flashcards', {
        preHandler: [fastify.authenticate],
        handler: update_user_flashcard
    });

    fastify.delete('/flashcards', {
        preHandler: [fastify.authenticate],
        handler: delete_user_flashcard
    });

    fastify.put('/flashcards/visibility', {
        preHandler: [fastify.authenticate],
        handler: toggle_flashcard_visibility
    });
}
