import { Request, Response } from "express";
import {z} from "zod"
import {prisma} from "@/database/prisma"
import { AppError } from "@/utils/AppError";
import { UserRole } from "@prisma/client";
import { hash } from "bcrypt";

class UsersController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().trim().min(2, {message: "Name must have at least 2 characters."}),
            email: z.string().trim().email({message: "Invalid email."}).toLowerCase(),
            password: z.string().trim().min(6,{message: "Password must have at least 6 characters."}),
            role: z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee),
        })

        const { name, email, password, role } = bodySchema.parse(request.body);

        const userSameWithEmail = await prisma.user.findFirst({where: {email}})

        if(userSameWithEmail){
            throw new AppError("User already exists.");
        }

        const hashedPassword = await hash(password, 8);

        //Cadastrando usuário no banco
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })
        
        response.status(201).json();
    }
}

export { UsersController }