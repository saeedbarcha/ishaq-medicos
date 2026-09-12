import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import { config } from './config/config.js';
import { morganMiddleware } from './config/morgan.js';
import { apiLimiter, mongoGuard } from './middlewares/rateLimiter.js';
import { mongoSanitize } from './middlewares/mongoSanitize.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';
import routes from './routes/v1/index.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.locals.mongoReady = false;

  if (config.env !== 'test') {
    app.use(morganMiddleware.successHandler);
    app.use(morganMiddleware.errorHandler);
  }

  app.use(helmet());
  app.use(
    cors({
      origin: config.env === 'development' ? true : config.frontendUrl,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      exposedHeaders: ['Content-Disposition'],
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(mongoSanitize);
  app.use(apiLimiter);

  app.get('/', (_req, res) => res.send({ response: 'OK' }));
  app.get('/api/v1', (_req, res) => res.send({ response: 'OK' }));
  app.get('/health', (_req, res) =>
    res.send({ success: true, message: 'ok', data: { service: 'ishaq-api', mongo: app.locals.mongoReady } }),
  );
  app.get('/api/health', (_req, res) => res.send('OK'));
  app.get('/api/ready', (_req, res) => res.send(app.locals.mongoReady ? 'READY' : 'NOT_READY'));

  app.use('/api/v1', mongoGuard, routes);

  app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);
  app.use(errorHandler);
  return app;
}

export default createApp;
