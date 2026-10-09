
import { Schema, model, Document } from 'mongoose';

export interface IFruit extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const fruitSchema = new Schema<IFruit>(
  {
    name: {
      type: String,
      required: [true, 'Fruit name is required.'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Fruit description is required.'],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Fruit price is required.'],
      min: [0, 'Price cannot be negative.'],
    },

    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative.'],
      default: 0,
    },

    category: {
      type: String,
      required: [true, 'Fruit category is required.'],
      trim: true,
    },

    imageUrl: {
      type: String,
      required: [true, 'Fruit image URL is required.'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Fruit = model<IFruit>('Fruit', fruitSchema);
