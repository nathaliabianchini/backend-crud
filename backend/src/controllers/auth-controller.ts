import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserRepository from "../repository/user-repository";

const SECRET_KEY = process.env.JWT_SECRET || "seu_segredo_super_secreto";

export class AuthController {
    async register(req: Request, res: Response):  Promise<void> {
        try {
            const { name, email, cpf, password } = req.body;

            const existingUser = await UserRepository.findByEmailOrCpf(email, cpf);
            if (existingUser) {
                res.status(400).json({ error: "O e-mail ou CPF informado já pertence a outro usuário." });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await UserRepository.create({
                name,
                email,
                cpf,
                password: hashedPassword
            });

            res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: newUser.id });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                res.status(500).json({ error: `Erro interno: ${error.message}` });
            } else {
                console.error(error);
                res.status(500).json({ error: "Erro interno no servidor" });
            }
        }
    }

    async signIn(req: Request, res: Response):  Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await UserRepository.getByEmail(email);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }

            if (user.deletedAt) {
                res.status(403).json({ error: "Esta conta foi desativada e não pode ser utilizada." });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Senha incorreta." });
                return;
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

            res.json({ message: "Login realizado com sucesso!", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}
