import express from "express";
import { getAllUsersTasks , getTaskByUser, createTask, updateTask, deleteTask } from "../controller/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { roleRoute } from "../middleware/roleRoute.js";
import { validateCreateTask, validateUpdateTask } from "../validation/task.validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/tasks/dashboard:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     description: Retrieve all tasks across all users. Requires admin role.
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/StatusParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/dashboard",roleRoute, getAllUsersTasks); // for admin access

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get tasks by user ID
 *     description: Retrieve all tasks for a specific user. Users can only view their own tasks unless they are admin.
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/StatusParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved user tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:id",protectRoute, getTaskByUser); // get all the tasks related to the logged in user only

/**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskRequest'
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Task created successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Complete project documentation
 *                 description: Write comprehensive API documentation
 *                 dueDate: 2025-12-31T23:59:59.000Z
 *                 status: pending
 *                 user:
 *                   _id: 507f1f77bcf86cd799439011
 *                   name: John Doe
 *                   email: john.doe@example.com
 *                   role: user
 *                 createdAt: 2025-11-19T10:00:00.000Z
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/create",protectRoute, validateCreateTask, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     description: Update task details. Users can only update their own tasks unless they are admin.
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Task successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Task updated successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 title: Updated task title
 *                 description: Updated description
 *                 dueDate: 2025-12-31T23:59:59.000Z
 *                 status: in progress
 *                 user:
 *                   _id: 507f1f77bcf86cd799439011
 *                   name: John Doe
 *                   email: john.doe@example.com
 *                   role: user
 *                 createdAt: 2025-11-19T10:00:00.000Z
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch("/:id",protectRoute, validateUpdateTask, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete a task. Users can only delete their own tasks unless they are admin.
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id",protectRoute, deleteTask);

export default router;