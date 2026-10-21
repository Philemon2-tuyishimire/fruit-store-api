import { z } from 'zod';

export const fruitSchema = z.object({
  name: z.string().min(2, "Fruit name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than zero"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  category: z.enum(['Tree Fruits', 'Tropical', 'Citrus', 'Berries']),
  imageUrl: z.string().url("Must be a valid direct image URL"),
});

export type FruitFormData = z.infer<typeof fruitSchema>;