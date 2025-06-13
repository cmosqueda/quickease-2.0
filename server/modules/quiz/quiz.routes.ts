import { FastifyInstance } from 'fastify';
import { get_user_quizzes, create_user_quiz, update_user_quiz, update_user_quiz_visibility, delete_user_quiz } from './quiz.controller';


export default async function quizRoutes(fastify: FastifyInstance) {
    fastify.get('/quiz/user', {
        preHandler: [fastify.authenticate],
        handler: get_user_quizzes,
    });

    fastify.post('/quiz', {
        preHandler: [fastify.authenticate],
        handler: create_user_quiz,
    });

    fastify.put('/quiz', {
        preHandler: [fastify.authenticate],
        handler: update_user_quiz,
    });

    fastify.put('/quiz/visibility', {
        preHandler: [fastify.authenticate],
        handler: update_user_quiz_visibility,
    });

    fastify.delete('/quiz', {
        preHandler: [fastify.authenticate],
        handler: delete_user_quiz,
    });
}
