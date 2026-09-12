import mongoose from 'mongoose';
import { createApp } from './app.js';
import { config } from './config/config.js';
import { logger } from './config/logger.js';

const app = createApp();

async function start() {
  try {
    await mongoose.connect(config.mongoose.url);
    app.locals.mongoReady = true;
    logger.info('MongoDB connected');
  } catch (error) {
    app.locals.mongoReady = false;
    logger.warn('MongoDB unavailable — API will return 503 so the storefront can fall back to local data.');
    logger.warn(error instanceof Error ? error.message : String(error));
  }

  app.listen(config.port, () => {
    logger.info(`Ishaq API listening on ${config.port} (${config.env})`);
  });
}

start();
