// src/routes/auth.routes.ts
import { Router } from 'express';
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Customer or Seller)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Philemon Tuyishimire
 *               email:
 *                 type: string
 *                 example: philemon@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *               role:
 *                 type: string
 *                 enum: [customer, seller, admin]
 *                 default: customer
 *                 description: Specify whether the user is a customer, seller, or admin
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request / validation error.
 *       409:
 *         description: User already exists.
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: philemon@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and role.
 *       401:
 *         description: Invalid email or password.
 */
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;