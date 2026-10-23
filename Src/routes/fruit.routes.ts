// src/routes/fruit.routes.ts
import { Router } from 'express';
import { 
  getFruits, 
  getFruitById, 
  createFruit, 
  updateFruit, 
  deleteFruit 
} from '../controllers/fruit.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getFruits);
router.get('/:id', getFruitById);

// Protected Routes for Admins and Sellers (Accepts JSON payload with imageUrl)
router.post('/', verifyToken, verifyRole(['admin', 'seller']), createFruit);
router.put('/:id', verifyToken, verifyRole(['admin', 'seller']), updateFruit);
router.delete('/:id', verifyToken, verifyRole(['admin', 'seller']), deleteFruit);

export default router;