// src/routes/user.routes.ts
import { Router } from 'express';
import { getAllUsers, deleteUser } from '../controllers/user.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';

const router = Router();

// Protected Admin-only routes for user management
router.get('/', verifyToken, verifyRole(['admin']), getAllUsers);
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteUser);

export default router;