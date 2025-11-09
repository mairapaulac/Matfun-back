//Receberá as requisições 

import { Request, Response } from "express";
import { AuthService } from "./authService.js";

const service = new AuthService();


export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, senha, dataNascimento, classId } = req.body;
            const result = await service.register({ name, email, senha, dataNascimento, classId});
            res.status(201).json(result);
        } catch (err: any) {
            res.status(400).json({ error: err.message })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const result = await service.login(email, senha);
            res.json(result);
        } catch (err: any) {
            res.status(401).json({ error: err.message });
        }
    }
}