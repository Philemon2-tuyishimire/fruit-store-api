
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Check that all required environment variables exist
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    'Missing Cloudinary configuration. Check your environment variables.'
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Configure Cloudinary storage for uploaded fruit images
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

    const extension = file.originalname
      .split('.')
      .pop()
      ?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      throw new Error(
        'Only JPG, JPEG, PNG, and WEBP images are allowed.'
      );
    }

    return {
      folder: 'fruit-store',
      allowed_formats: allowedExtensions,
      public_id: `${Date.now()}-${file.originalname
        .split('.')
        .slice(0, -1)
        .join('.')
        .replace(/[^a-zA-Z0-9_-]/g, '-')}`,
    };
  },
});

// Configure Multer
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Uploaded file must be an image.'));
      return;
    }

    callback(null, true);
  },
});

export { cloudinary };
