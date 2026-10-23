// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { User } from '../models/User';

// Get all users (Admin only)
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Exclude password hashes and sensitive token details from the response
    const users = await User.find().select(
      '-passwordHash -resetPasswordToken -resetPasswordExpires'
    );
    res.status(200).json(users);
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'An error occurred while fetching users.',
    });
  }
};

// Delete a user by ID (Admin only)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({
        message: 'User not found.',
      });
      return;
    }

    res.status(200).json({
      message: 'User deleted successfully.',
    });
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the user.',
    });
  }
};