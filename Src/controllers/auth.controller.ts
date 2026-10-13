import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service';

// Register a new user
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check whether the request body exists
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        message:
          'Request body is missing or invalid. Please send JSON data.',
      });
      return;
    }

    const { name, email, password, role } = req.body;

    // Validate required fields
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      res.status(400).json({
        message: 'Name, email, and password are required.',
      });
      return;
    }

    // Validate email format
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      res.status(400).json({
        message: 'Please provide a valid email address.',
      });
      return;
    }

    // Validate password length
    if (password.length < 8 || password.length > 128) {
      res.status(400).json({
        message: 'Password must be between 8 and 128 characters.',
      });
      return;
    }

    // Validate role if supplied
    if (
      role !== undefined &&
      !['customer', 'admin'].includes(role)
    ) {
      res.status(400).json({
        message: 'Invalid role.',
      });
      return;
    }

    // Check whether the user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        message: 'User already exists with this email.',
      });
      return;
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role || 'customer',
    });

    await user.save();

    let welcomeEmailSent = true;

    try {
      await sendWelcomeEmail(user.name, user.email);
    } catch (error: unknown) {
      welcomeEmailSent = false;
      console.error('Welcome email delivery failed:', error);
    }

    // Never return the password or password hash
    res.status(201).json({
      message: welcomeEmailSent
        ? 'User registered successfully.'
        : 'User registered successfully, but the welcome email could not be sent.',
      userId: user._id,
      welcomeEmailSent,
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);

    res.status(500).json({
      message: 'An error occurred during registration.',
    });
  }
};

// Log in an existing user
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check whether the request body exists
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        message:
          'Request body is missing or invalid. Please send JSON data.',
      });
      return;
    }

    const { email, password } = req.body;

    // Validate required fields
    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      res.status(400).json({
        message: 'Email and password are required.',
      });
      return;
    }

    // Find the user
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password.',
      });
      return;
    }

    // Compare the supplied password with the stored hash
    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      res.status(401).json({
        message: 'Invalid email or password.',
      });
      return;
    }

    // Ensure JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured.');

      res.status(500).json({
        message: 'Authentication service is not configured.',
      });
      return;
    }

    // Generate the authentication token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: '1d',
      }
    );

    // Return the token and user information
    res.status(200).json({
      message: 'Login successful.',
      token,
      role: user.role,
    });
  } catch (error: unknown) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'An error occurred during login.',
    });
  }
};

// 1. Request Password Reset
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        message: 'Request body is missing or invalid. Please send JSON data.',
      });
      return;
    }

    const { email } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
      res.status(400).json({
        message: 'Email is required.',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = (await User.findOne({ email: normalizedEmail })) as IUser | null;

    // Security practice: Return a generic message even if the user doesn't exist
    if (!user) {
      res.status(200).json({
        message: 'If that email exists, a password reset link has been sent.',
      });
      return;
    }

    // Generate a secure random token and set 15-minute expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    let emailSent = true;
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error: unknown) {
      emailSent = false;
      console.error('Password reset email delivery failed:', error);
    }

    res.status(200).json({
      message: emailSent
        ? 'If that email exists, a password reset link has been sent.'
        : 'Could not send the password reset email at this time. Please try again later.',
    });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'An error occurred during password reset request.',
    });
  }
};

// 2. Reset Password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        message: 'Request body is missing or invalid. Please send JSON data.',
      });
      return;
    }

    const { token, newPassword } = req.body;

    if (typeof token !== 'string' || !token || typeof newPassword !== 'string' || !newPassword) {
      res.status(400).json({
        message: 'Token and new password are required.',
      });
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({
        message: 'Password must be between 8 and 128 characters.',
      });
      return;
    }

    const user = (await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is still valid
    })) as IUser | null;

    if (!user) {
      res.status(400).json({
        message: 'Invalid or expired password reset token.',
      });
      return;
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    // Clear out reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Password has been successfully reset.',
    });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'An error occurred while resetting the password.',
    });
  }
};