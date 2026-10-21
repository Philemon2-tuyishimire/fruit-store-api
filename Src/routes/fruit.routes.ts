// src/routes/fruit.routes.ts
import { Router } from 'express';
import { getFruits, getFruitById, createFruit, updateFruit, deleteFruit } from '../controllers/fruit.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { upload } from '../config/cloudinary';

const router = Router();

router.get('/', getFruits);
router.get('/:id', getFruitById);

// Protected Routes for Admins and Sellers
router.post('/', verifyToken, verifyRole(['admin', 'seller']), upload.single('image'), createFruit);
router.put('/:id', verifyToken, verifyRole(['admin', 'seller']), upload.single('image'), updateFruit);
router.delete('/:id', verifyToken, verifyRole(['admin', 'seller']), deleteFruit);

export default router;