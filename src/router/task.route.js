import express from "express";
import { getAllUsersTasks , getTaskByUser, createTask, updateTask, deleteTask } from "../controller/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { roleRoute } from "../middleware/roleRoute.js";

const router = express.Router();

router.get("/dashboard",roleRoute, getAllUsersTasks); // for admin access
router.get("/:id",protectRoute, getTaskByUser); // get all the tasks related to the logged in user only
router.post("/create",protectRoute, createTask);
router.patch("/:id",protectRoute, updateTask);
router.delete("/:id",protectRoute, deleteTask);

export default router;