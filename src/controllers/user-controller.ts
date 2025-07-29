import { Request, Response } from "express";
import * as UserRepository from "../repository/user-repository";
import * as PreferencesRepository from "../repository/preferences-repository";
import { uploadImage } from "../services/s3-service";
import bcrypt from "bcrypt";

export default class UserController {

    async getUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(401).json({ error: "Authentication required." });
            }

            const user = await UserRepository.getById(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            if (user.deletedAt) {
                return res.status(403).json({ error: "This account has been deactivated and cannot be used." });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    }

    async getPreferences(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(401).json({ error: "Authentication required." });
            }

            const user = await UserRepository.getById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const preferences = await PreferencesRepository.getPreferences(userId);

            if (!preferences || preferences.length === 0) {
                return res.status(404).end();
            }

            return res.status(200).json(preferences);
        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    }

    async setPreferences(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const { interests } = req.body;

            if (!userId) {
                return res.status(401).json({ error: "Authentication required." });
            }

            if (!interests) {
                return res.status(400).json({ error: "Please fill in the required fields correctly." });
            }

            if (!Array.isArray(interests)) {
                return res.status(400).end;
            }

            const user = await UserRepository.getById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const preferences = await PreferencesRepository.setPreferences(userId, interests);

            return res.status(201).json(preferences);
        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    }

    async updateAvatar(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            if (!userId) return res.status(401).json({ error: "Authentication required." });
            if (!req.file) return res.status(400).json({ error: "Please fill in the required fields correctly." });

            const user = await UserRepository.getById(userId);
            if (!user) return res.status(404).json({ error: "User not found." });

            const imageUrl = await uploadImage(req.file);
            await UserRepository.update({ avatar: imageUrl }, userId);

            return res.status(200).json({ avatar: imageUrl });

        } catch (error) {
            console.error(error);

            if (error instanceof Error && error.message.includes('image')) {
                return res.status(400).json({ error: "The image must be a PNG or JPG file." });
            }

            return res.status(500).end();
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const tokenUserId = req.user?.id;
            const { name, email, currentPassword, newPassword } = req.body;

            if (!tokenUserId) return res.status(401).json({ error: "Authentication required." });

            if (userId !== tokenUserId) return res.status(403).end();

            if (!name || !email) return res.status(400).json({ error: "Please fill in the required fields correctly." });

            const user = await UserRepository.getById(userId);
            if (!user) return res.status(404).json({ error: "User not found." });

            if (user.deletedAt) return res.status(403).json({ error: "This account has been deactivated and cannot be used." });

            const emailExists = await UserRepository.getByEmail(email);
            if (emailExists && emailExists.id !== userId) return res.status(409).json({ error: "The provided email already belongs to another user." });

            let hashedPassword = user.password;
            if (newPassword) {
                if (!currentPassword) return res.status(400).end();

                const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isPasswordValid) return res.status(401).json({ error: "Incorrect password." });

                hashedPassword = await bcrypt.hash(newPassword, 10);
            }

            const updatedUser = await UserRepository.update({ name, email, password: hashedPassword }, userId);
            const { password, ...userWithoutPassword } = updatedUser;
            return res.status(200).json(userWithoutPassword);

        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    }

    async deactivateUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(401).json({ error: "Authentication required." });
            }

            const user = await UserRepository.getById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const deactivatedUser = await UserRepository.deactivate(userId);

            return res.status(200).json({
                message: "Account deactivated successfully.",
                user: deactivatedUser
            });
        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    }
}