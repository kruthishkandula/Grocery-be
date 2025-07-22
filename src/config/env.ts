import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

// Define the environment schema using Zod
const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test', 'dev', 'prod']).default('development'),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  CORS_ORIGIN: z.string(),
  API_URL: z.string().optional(),
  WEB_URL: z.string(),
  STRAPI_URL: z.string(),

  // Redis configuration (not used)
  REDIS_URL: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_TLS: z.boolean().default(false),
  REDIS_DB: z.string().transform((val) => parseInt(val) || 0).default('0'),
  REDIS_KEY_PREFIX: z.string().default('app:'),

  // CMS configuration
  CMS_API: z.string().default('http://localhost:3005'),
  CMS_TOKEN: z.string().default(''),

  // Cloudinary configuration
  CLOUDINARY_NAME: z.string().default(''),
  CLOUDINARY_KEY: z.string().default(''),
  CLOUDINARY_SECRET: z.string().default(''),
});

// Validate environment variables
export const ENV = envSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  API_URL: process.env.API_URL,
  WEB_URL: process.env.WEB_URL,
  STRAPI_URL: process.env.STRAPI_URL,
  
  // Redis configuration
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_TLS: process.env.REDIS_TLS === 'true',
  REDIS_DB: process.env.REDIS_DB,
  REDIS_KEY_PREFIX: process.env.REDIS_KEY_PREFIX,

  // CMS configuration
  CMS_API: process.env.CMS_API,
  CMS_TOKEN: process.env.CMS_TOKEN,

  // Cloudinary configuration
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || '',
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY || '',
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET || '',
});
