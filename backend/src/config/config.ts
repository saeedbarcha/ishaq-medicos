import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
  PORT: Joi.number().default(5050),
  MONGODB_URI: Joi.string().default('mongodb://127.0.0.1:27017/ishaq-medical'),
  JWT_SECRET: Joi.string().default('dev-only-change-in-production'),
  REFRESH_TOKEN_SECRET: Joi.string().default('dev-only-refresh-change-in-production'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
  FRONTEND_URL: Joi.string().default('http://localhost:5173'),
  COOKIE_SECURE: Joi.string().valid('true', 'false').default('false'),
  UPLOAD_DIR: Joi.string().default('./uploads'),
  MAX_FILE_SIZE_MB: Joi.number().default(8),
  ADMIN_EMAIL: Joi.string().email({ tlds: { allow: false } }).default('admin@ishaq.local'),
  ADMIN_PASSWORD: Joi.string().default('Admin123!'),
}).unknown();

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV as 'production' | 'development' | 'test',
  port: envVars.PORT as number,
  mongoose: {
    url: envVars.MONGODB_URI as string,
  },
  jwt: {
    secret: envVars.JWT_SECRET as string,
    refreshSecret: envVars.REFRESH_TOKEN_SECRET as string,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES as number,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS as number,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES as number,
  },
  frontendUrl: envVars.FRONTEND_URL as string,
  cookieSecure: envVars.COOKIE_SECURE === 'true',
  uploadDir: envVars.UPLOAD_DIR as string,
  maxFileSizeMb: envVars.MAX_FILE_SIZE_MB as number,
  admin: {
    email: envVars.ADMIN_EMAIL as string,
    password: envVars.ADMIN_PASSWORD as string,
  },
};

export default config;
