import { FastifyReply, FastifyRequest } from "fastify";
import { loginUser, registerUser } from "./auth.service";
import db_client from "../../utils/client";

export async function login_user(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
        email: string;
        password: string;
    }

    try {

        const user = await loginUser(email, password)

        if (user == false) {
            return reply.code(400).send({
                message: "Check your credentials."
            })
        }

        const token = await reply.jwtSign(user)

        reply.setCookie('QUICKEASE_TOKEN', token, {
            path: '/',
            secure: true,
            httpOnly: true,
        }).code(200).send(user)

    } catch (err) {
        reply.code(400).send({
            message: "Bad request, check your credentials."
        })
    }

}

export async function register_user(request: FastifyRequest, reply: FastifyReply) {
    const { firstName, lastName, email, password
    } = request.body as { firstName: string, lastName: string, email: string, password: string }
    const existed = await db_client.user.findUnique({
        where: {
            email: email
        }
    })

    if (existed) {
        return reply.code(406).send({
            message: "Email already in use."
        })
    }

    const user = await registerUser(firstName, lastName, email, password)
    const token = await reply.jwtSign(user)

    reply.setCookie('QUICKEASE_TOKEN', token, {
        path: '/',
        httpOnly: true,
        secure: true
    }).send({
        token: token
    })
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('QUICKEASE_TOKEN')

    return reply.code(200).send('Logout successfully.')
}