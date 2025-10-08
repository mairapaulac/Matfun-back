//Lógica de autenticação
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userRepository } from "../repositories/userRepository.js"
import { comparePassword, hashPassword } from "../utils/hash.js";

const UserRepository = new userRepository();



export class AuthService {

    async register(data: {
        name: string;
        email: string;
        senha: string;
        dataNascimento: Date;
        classId: number;
    }) {
        const hashedPassword = await hashPassword(data.senha);


        const user = await UserRepository.createUser({
            ...data,
            senha: hashedPassword
        })


    }
}

