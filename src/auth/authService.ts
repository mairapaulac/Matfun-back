//Lógica de autenticação

import { UserRepository } from "../repositories/userRepository.js";
import { UserService } from "../services/userService.js";
import { comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const userRepository = new UserRepository();
const userService = new UserService();

export class AuthService {

    async register(data: {
        name: string;
        email: string;
        senha: string;
        dataNascimento: Date;
        classId: number;
    }) {

        const user = await userService.createUser(data);

        //gera token jwt 
        const token = generateToken(user.userId);

        return {
            token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                gradeName: user.class.grade.gradeName,
                classLetter: user.class.classLetter,
            },
        };
    }

    async login(email: string, senha: string) {
        const user = await userService.getUserByEmail(email);

        if (!user) 
            throw new Error("Usuário não encontrado!");

        const validPassword = await comparePassword(senha, user.senha);

        if (!validPassword)
            throw new Error("Senha incorreta!");


        await userRepository.updateLastLogin(user.userId);

        const token = generateToken(user.userId);

        return {
            token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                gradeName: user.class.grade.gradeName,
                classLetter: user.class.classLetter,
            },
        };
    }
}

