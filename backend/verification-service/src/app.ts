import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from './utils/logger';
import { healthRouter } from './routes/health';
import { verifyRouter } from './routes/verify';
import { errorHandler } from './middleware/error';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  pinoHttp({
    logger,
    customProps: () => ({ service: 'verification-service' })
  })
);

// Routes
app.use('/', healthRouter);
app.use('/', verifyRouter);
app.get('/', (_req, res) => {
  res.json({ service: 'verification-service', ok: true });
});

// 404 + error
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);

export default app;
