import { Request, Response } from "express";

class RefundsController {
    async create(request: Request, response: Response) {
        response.json({message: "Refund created."})
    }
}

export { RefundsController }