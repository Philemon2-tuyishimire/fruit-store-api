
import { Request, Response } from 'express';
import { Fruit } from '../models/Fruit';

// Get all fruits
export const getFruits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fruits = await Fruit.find();

    res.status(200).json({
      count: fruits.length,
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

// Create a new fruit
export const createFruit = async (
  req: Request,
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

    const imageUrl = req.file?.path;

    if (!imageUrl) {
      res.status(400).json({
        message:
          'Fruit image is required. Upload an image using the image field.',
      });
      return;
    }

    const fruit = new Fruit({
      name: name.trim(),
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
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
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    const fruit = await Fruit.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!fruit) {
      res.status(404).json({
        message: 'Fruit not found.',
      });
      return;
    }

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
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fruit = await Fruit.findByIdAndDelete(req.params.id);

    if (!fruit) {
      res.status(404).json({
        message: 'Fruit not found.',
      });
      return;
    }

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
