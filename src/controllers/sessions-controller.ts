import { Request, Response } from "express"
import {z} from "zod"
import {prisma} from "../database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"
import { authConfig } from "@/configs/auth"
import { sign } from "jsonwebtoken"

class SessionsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            email: z.string().email({message: "Invalid email."}),
            password: z.string(),
        })

        const { email, password } = bodySchema.parse(request.body);

        //Recuperando o usuário
        
        const user = await prisma.user.findFirst({where: {email}})

        if(!user) {
            throw new AppError("Email or password incorrect.", 401)
        }

        const passwrodMatched = await compare(password, user.password)

        if(!passwrodMatched) {
            throw new AppError("Email or password incorrect.", 401)
        }

        const {secret, expiresIn} = authConfig.jwt

        const token = sign({role: user.role}, secret, {
            subject: user.id,
            expiresIn
        })

        const {password: _, ...userWithoutPassword} = user

        response.json({token, user: userWithoutPassword})
    }
}

export { SessionsController }