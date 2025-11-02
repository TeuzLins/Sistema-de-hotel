import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { responseWrapper } from './middlewares/responseWrapper.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const openapiSpec = require('./docs/openapi.json');

export function createServer() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/health', (req, res) => res.json({ data: 'ok' }));

  app.use(responseWrapper);
  app.use('/api/v1', apiRouter);

  if (env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  }

  app.use(errorHandler);

  return app;
}