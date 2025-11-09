//deve ser usado em qualquer rota que tenha autenticação

import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/jwt.js";

const SECRET = process.env.JWT_SECRET as string;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = validateToken(token, SECRET);
    (req as any).user = decoded;
    return next(); 
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
