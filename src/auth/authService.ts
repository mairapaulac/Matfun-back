//Lógica de autenticação
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userRepository } from "../repositories/userRepository.js"

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export function generateToken(userId: number) {
    return jwt.sign({ userId }, SECRET, { expiresIn: EXPIRES_IN });
}