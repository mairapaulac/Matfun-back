// Funções JWT

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: number) {
    return jwt.sign({ userId }, SECRET, { expiresIn: "1h" });
}

export function validateToken(token: string, secret: string): JwtPayload | string {
  return jwt.verify(token, secret);
}
