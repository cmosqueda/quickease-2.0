import Fastify from 'fastify';

import { fastifyEnv } from '@fastify/env'
import { fastifyJwt } from '@fastify/jwt'

const serverApp = Fastify({ logger: true, },);

// configs

/*
@ Configuration for dotenv / loading .ENV files
*/
serverApp.register(fastifyEnv, {
    confKey: 'config',
    schema: {
        type: 'object',
        required: ['PORT'],
        properties: {
            PORT: {
                type: 'string',
                default: 3002
            }
        }
    }
})

/*
@ Configuration for JWT
*/
serverApp.register(fastifyJwt, {
    secret: 'dok'
})
// configs

// routes
serverApp.get('/', async (request, reply) => {
    return { status: 200, message: "Server running succesfully." }
})
serverApp.get('/auth/login', async (request, reply) => {
    try {
    } catch (err) {
        return { status: 400, message: 'Error logging in.' }
    }
})

const start = async () => {
    try {
        await serverApp.listen({ port: 3002 });
        console.log('Server listening on http://localhost:3002');
    } catch (err) {
        serverApp.log.error(err);
        process.exit(1);
    }
};

start();

export default serverApp