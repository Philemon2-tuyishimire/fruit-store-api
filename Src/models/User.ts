import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'seller' | 'customer'; // Added 'seller' here
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'seller', 'customer'], // Added 'seller' to allowed database values
    default: 'customer' 
  },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

export const User = model<IUser>('User', userSchema);