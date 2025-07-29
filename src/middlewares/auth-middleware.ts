import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
    interface Request {
        userId?: string;
    }
}

const jwtSecret = process.env.JWT_SECRET!;

export default function authGuard(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        response.status(401).json({ message: "Token not provided" });
        return;
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const user = jwt.verify(token, jwtSecret) as {
            id: string;
            name: string;
            email: string;
        };
        request.userId = user.id;
        next();
    } catch (error) {
        response.status(401).json({ message: "Invalid or expired token" });
    }
}