//O service de usuário nos permite manipular as regras de negócio referentes à usuários

import { hashPassword } from "../utils/hash.js";
import { UserRepository } from "../repositories/userRepository.js";

const userRepository = new UserRepository();

export class UserService {

    async getAllUsers() {
        return await userRepository.findAllUsers();
    }

    async getUserByEmail(email: string) {
        return userRepository.findByEmail(email);
    }

    async getUserById(userId: number) {
        return userRepository.findById(userId);
    }

    async createUser(data: {
        name: string,
        email: string,
        senha: string,
        dataNascimento: Date,
        classId: number;
    }) {

        //Verifica se já existe algum usuário com o mesmo email

        const existingUsr = await userRepository.findByEmail(data.email);
        
        if (existingUsr)
            throw new Error("E-mail já cadastrado");

        //Criptografa a senha

        const hashedPassword = await hashPassword(data.senha);

        return await userRepository.createUser({
            ...data,
            senha: hashedPassword,
        });
    }


}