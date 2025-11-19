import express from "express";
import { signup, login, logout } from "../controller/auth.controller.js";
import { validateSignup, validateLogin } from "../validation/auth.validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 role:
 *                   type: string
 *                   example: user
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/signup", validateSignup, signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and receive JWT token in HTTP-only cookie
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 role:
 *                   type: string
 *                   example: user
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Invalid credentials
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Clear authentication token and logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.post("/logout", logout);

export default router;