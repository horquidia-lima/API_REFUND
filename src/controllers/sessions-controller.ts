import { Request, Response } from "express"

class SessionsController {
    async create(request: Request, response: Response) {
        response.json({message: "Login realizado com sucesso."})
    }
}

export { SessionsController }