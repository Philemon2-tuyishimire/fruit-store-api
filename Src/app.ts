import express, {
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
import authRoutes from './routes/auth.routes';
import fruitRoutes from './routes/fruit.routes';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fruits', fruitRoutes);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    console.error('Unhandled API error:', error);

    const errorDetails =
      typeof error === 'object' && error !== null
        ? (error as Record<string, unknown>)
        : undefined;
    const statusCode = errorDetails?.statusCode ?? errorDetails?.status;
    const status =
      typeof statusCode === 'number' &&
      Number.isInteger(statusCode) &&
      statusCode >= 400 &&
      statusCode < 600
        ? statusCode
        : 500;
    const message =
      status < 500
        ? error instanceof Error
          ? error.message
          : typeof errorDetails?.message === 'string'
            ? errorDetails.message
            : 'Request failed.'
        : 'Internal server error.';

    res.status(status).json({ message });
  }
);

export default app;