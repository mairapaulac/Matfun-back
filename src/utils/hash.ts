// Funções bcrpyt

import bcrypt from "bcrypt"


const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 20);

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password:string, hash: string): Promise <boolean> {
    return await bcrypt.compare(password, hash);
}