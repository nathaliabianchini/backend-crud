import "dotenv/config";
import express, { json } from "express";
import cors from "cors";

import authRoutes from "./routes/auth-routes";
import authGuard from "./middlewares/auth-middleware";
import userRoutes from "./routes/user-routes";

import { createBucket } from "./services/s3-service";

import swaggerDocument from './swagger.json';
import swaggerUi from "swagger-ui-express";

async function initialize() {
    try {
        await createBucket();
    } catch (error) {
        console.log("Bucket already exists or there is an error in its creation");
    }
}
initialize();

const server = express();

server.use(json());
server.use(cors({ origin: "*" }));

server.get("/test", (req, res) => {
    res.send("test route working!");
});
server.use("/auth", authRoutes);
server.use("/user", authGuard, userRoutes);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("Swagger documentation available in http://localhost:3000/api-docs")
});
