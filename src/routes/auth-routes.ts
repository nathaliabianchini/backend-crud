import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/sign-in", authController.signIn);

export default router;
