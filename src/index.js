import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./libs/mongoDB.js";
import helmet from "helmet";
import logger from "./libs/logger.js";
import authRoutes from "./router/auth.route.js";
import taskRoutes from "./router/task.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({
    origin: "*", // Just making the API public for now
    credentials: true
}));
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);

// To setup the frontend part
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectDB();
  logger.info(`API Gateway is running on port ${port}`);
});