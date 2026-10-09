// src/routes/fruit.routes.ts
import { Router } from 'express';
import { getFruits, getFruitById, createFruit, updateFruit, deleteFruit } from '../controllers/fruit.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';
import { upload } from '../config/cloudinary';

const router = Router();

router.get('/', getFruits);
router.get('/:id', getFruitById);

// Protected Admin Routes
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createFruit);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateFruit);
router.delete('/:id', verifyToken, verifyAdmin, deleteFruit);

export default router;