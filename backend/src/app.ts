import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { loggerMiddleware } from './middleware/logger';

import notificationsRouter from './routes/notifications';

// Configure dotenv to find the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Mount middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Mount the notifications router
app.use('/api/v1/notifications', notificationsRouter);


app.listen(port, () => {
  // Use console.log ONLY for server startup notifications (permissible)
  console.log(`[Server] Backend initialized at http://localhost:${port}`);
  console.log(`[Auth] Using Mock Token verification: ${process.env.USE_MOCK_AUTH}`);
});

export default app;
