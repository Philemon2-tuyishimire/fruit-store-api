import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Fruit } from '../models/Fruit';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'customer' | 'seller' | 'admin';
    name?: string;
  };
}

// Get all fruits with pagination, filtering, searching, and seller isolation
export const getFruits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;

    const filter: Record<string, unknown> = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Optionally check if a logged-in seller is making the request
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as { role: string; name?: string };

        // If user is a seller, isolate products to only those created by them
        if (decoded.role === 'seller' && decoded.name) {
          filter.createdBy = decoded.name;
        }
      } catch (err) {
        // Invalid token; proceed as guest/customer
      }
    }

    const skip = (page - 1) * limit;

    const [fruits, totalFruits] = await Promise.all([
      Fruit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Fruit.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalFruits / limit);

    res.status(200).json({
      success: true,
      count: fruits.length,
      pagination: {
        totalFruits,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      fruits,
    });
  } catch (error: unknown) {
    console.error('Get fruits error:', error);
    res.status(500).json({
      message: 'Failed to retrieve fruits.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get a single fruit by ID
export const getFruitById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fruit = await Fruit.findById(req.params.id);

    if (!fruit) {
      res.status(404).json({
        message: 'Fruit not found.',
      });
      return;
    }

    res.status(200).json(fruit);
  } catch (error: unknown) {
    console.error('Get fruit by ID error:', error);
    res.status(500).json({
      message: 'Failed to retrieve fruit.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Create a new fruit (Attaches current user as creator)
export const createFruit = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        message: 'Request body is missing or invalid.',
      });
      return;
    }

    const { name, description, price, stock, category } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      res.status(400).json({
        message: 'Name, price, stock, and category are required.',
      });
      return;
    }

    const imageUrl = req.file?.path || req.body.imageUrl;

    if (!imageUrl) {
      res.status(400).json({
        message: 'Fruit image URL or file is required.',
      });
      return;
    }

    const creatorName = req.user?.name || 'Admin';

    const fruit = new Fruit({
      name: name.trim(),
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
      createdBy: creatorName,
    });

    await fruit.save();

    res.status(201).json({
      message: 'Fruit created successfully.',
      fruit,
    });
  } catch (error: unknown) {
    console.error('Create fruit error:', error);
    res.status(500).json({
      message: 'Failed to create fruit.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update an existing fruit
export const updateFruit = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const fruitId = req.params.id;
    const existingFruit = await Fruit.findById(fruitId);

    if (!existingFruit) {
      res.status(404).json({
        message: 'Fruit not found.',
      });
      return;
    }

    if (
      req.user?.role === 'seller' &&
      existingFruit.createdBy &&
      existingFruit.createdBy !== req.user.name
    ) {
      res.status(403).json({
        message: 'Access denied. You can only update your own added fruits.',
      });
      return;
    }

    const updateData: Record<string, unknown> = {
      ...req.body,
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    const fruit = await Fruit.findByIdAndUpdate(fruitId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Fruit updated successfully.',
      fruit,
    });
  } catch (error: unknown) {
    console.error('Update fruit error:', error);
    res.status(500).json({
      message: 'Failed to update fruit.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Delete a fruit
export const deleteFruit = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const fruitId = req.params.id;
    const existingFruit = await Fruit.findById(fruitId);

    if (!existingFruit) {
      res.status(404).json({
        message: 'Fruit not found.',
      });
      return;
    }

    if (
      req.user?.role === 'seller' &&
      existingFruit.createdBy &&
      existingFruit.createdBy !== req.user.name
    ) {
      res.status(403).json({
        message: 'Access denied. You can only delete your own added fruits.',
      });
      return;
    }

    await Fruit.findByIdAndDelete(fruitId);

    res.status(200).json({
      message: 'Fruit deleted successfully.',
    });
  } catch (error: unknown) {
    console.error('Delete fruit error:', error);
    res.status(500).json({
      message: 'Failed to delete fruit.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};