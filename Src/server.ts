
import dotenv from 'dotenv';

import dns from 'node:dns';

dns.setServers(['1.1.1.1', '1.0.0.1']);

dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger Docs available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
