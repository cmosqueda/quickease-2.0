import db_client from "../../utils/client";
import bcrypt from 'bcrypt'
import { hashPassword, verifyPassword } from "../../utils/hash";

export async function loginUser(email: string, password: string) {
    const user = await db_client.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) return false;
    console.log(user.password, password)

    const isMatch = user && (await bcrypt.compare(password, user.password))
    if (!user || !isMatch) {
        return false
    }

    return isMatch ? user : false;
}

export async function registerUser(firstName: string, lastName: string, email: string, password: string) {

    const hashed = await hashPassword(password)

    const user = await db_client.user.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashed
        }
    })

    return user
}