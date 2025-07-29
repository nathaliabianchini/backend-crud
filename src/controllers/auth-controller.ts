import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserRepository from "../repository/user-repository";

const SECRET_KEY = process.env.JWT_SECRET || "your_super_secret_secret";

export class AuthController {
    async register(req: Request, res: Response):  Promise<void> {
        try {
            const { name, email, cpf, password } = req.body;

            const existingUser = await UserRepository.findByEmailOrCpf(email, cpf);
            if (existingUser) {
                res.status(400).json({ error: "The provided email or CPF already belongs to another user." });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await UserRepository.create({
                name,
                email,
                cpf,
                password: hashedPassword
            });

            res.status(201).json({ message: "User succesfulyy registered!", userId: newUser.id });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                res.status(500).json({ error: `Internal error: ${error.message}` });
            } else {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    async signIn(req: Request, res: Response):  Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await UserRepository.getByEmail(email);
            if (!user) {
                res.status(404).json({ error: "User not found." });
                return;
            }

            if (user.deletedAt) {
                res.status(403).json({ error: "This account has been deactivated and cannot be used." });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Incorrect password." });
                return;
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

            res.json({ message: "Login successful!", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
