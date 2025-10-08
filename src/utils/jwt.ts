// Funções JWT

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: number) {
    return jwt.sign({ userId }, SECRET, { expiresIn: "1h" });
}