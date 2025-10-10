//Lógica de autenticação

import { userRepository } from "../repositories/userRepository.js"
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

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

        //gera token jwt 
        const token = generateToken(user.userId);

        return { token, user };
    }

    async login(email: string, senha: string) {
        const user = await UserRepository.findByEmail(email);

        if (!user) 
            throw new Error("Usuário não encontrado!");

        const validPassword = await comparePassword(senha, user.senha);

        if (!validPassword)
            throw new Error("Senha incorreta!");


        await UserRepository.updateLastLogin(user.userId);

        const token = generateToken(user.userId);

        return { token, user };
    }
}

