import { FastifyInstance } from 'fastify';
import { get_user_quizzes, create_user_quiz, update_user_quiz, update_user_quiz_visibility, delete_user_quiz } from './quiz.controller';


export default async function quizRoutes(fastify: FastifyInstance) {
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        handler: get_user_quizzes,
    });

    fastify.post('/create-quiz', {
        preHandler: [fastify.authenticate],
        handler: create_user_quiz,
    });

    fastify.put('/update-quiz', {
        preHandler: [fastify.authenticate],
        handler: update_user_quiz,
    });

    fastify.put('/toggle-visibility', {
        preHandler: [fastify.authenticate],
        handler: update_user_quiz_visibility,
    });

    fastify.delete('/delete-quiz', {
        preHandler: [fastify.authenticate],
        handler: delete_user_quiz,
    });
}
