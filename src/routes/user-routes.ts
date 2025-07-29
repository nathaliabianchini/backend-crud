import { Router } from "express";
import UserController from "../controllers/user-controller";
import upload from "../multer/multer";

const router = Router();
const userController = new UserController();

router.get("/:userId", async (req, res) => {
    await userController.getUser(req, res);
});

router.get("/:userId/preferences", async (req, res) => {
    await userController.getPreferences(req, res);
});

router.post("/:userId/preferences/define", async (req, res) => {
    await userController.setPreferences(req, res);
});

router.put("/:userId/avatar", upload.single('avatar'), async (req, res) => {
    await userController.updateAvatar(req, res);
});

router.put("/:userId/update", async (req, res) => {
    await userController.updateUser(req, res);
});

router.delete("/:userId/deactivate", async (req, res) => {
    await userController.deactivateUser(req, res);
});

export default router;