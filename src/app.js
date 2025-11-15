import express from 'express';
import { securityMiddlewares } from './middlewares/security.js';
import { globalLimiter } from './middlewares/rateLimit.js';
import { httpLogger } from './utils/logger.js';
import { errorHandler, notFound } from './middlewares/error.js';
import api from './routes/index.js';
import { requestId } from './middlewares/requestId.js';
import cors from "cors";

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use(cors({ origin: ['http://192.168.13.78:5173', 'http://localhost:5173'] , credentials: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestId);
  app.use(httpLogger);
  app.use(...securityMiddlewares());
  app.use(globalLimiter);

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api', api);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
