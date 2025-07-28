import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import authRoutes from "./routes/auth-routes";
import authGuard from "./middlewares/auth-middleware";
import userRoutes from "./routes/user-routes";
import { createBucket } from "./services/s3-service"

async function initialize() {
    try {
        await createBucket();
    } catch (error) {
        console.log("Bucket já existe ou erro na criação");
    }
}
initialize();

const server = express();

server.use(json());
server.use(cors({ origin: "*" }));

server.get("/test", (req, res) => {
    res.send("rota de teste funcionando!");
});
server.use("/auth", authRoutes);
server.use("/user", authGuard, userRoutes);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
