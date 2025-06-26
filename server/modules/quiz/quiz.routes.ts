import { FastifyInstance } from 'fastify';
import { get_user_quizzes, create_user_quiz, update_user_quiz, update_user_quiz_visibility, delete_user_quiz, get_quiz, submit_quiz_attempt, get_quiz_attempt } from './quiz.controller';


export default async function quizRoutes(fastify: FastifyInstance) {
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        handler: get_user_quizzes,
    });

    fastify.get('/:quiz_id', {
        preHandler: [fastify.authenticate],
        handler: get_quiz
    })

    fastify.get('/attempt/:attempt_id', {
        preHandler: [fastify.authenticate],
        handler: get_quiz_attempt,
    })

    fastify.post('/submit', {
        preHandler: [fastify.authenticate],
        handler: submit_quiz_attempt
    })

    fastify.post('/create', {
        preHandler: [fastify.authenticate],
        handler: create_user_quiz,
    });

    fastify.put('/update', {
        preHandler: [fastify.authenticate],
        handler: update_user_quiz,
    });

    fastify.put('/toggle-visibility', {
        preHandler: [fastify.authenticate],
        handler: update_user_quiz_visibility,
    });

    fastify.delete('/delete', {
        preHandler: [fastify.authenticate],
        handler: delete_user_quiz,
    });
}
