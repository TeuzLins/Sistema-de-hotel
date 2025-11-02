import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/hotel',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  TIMEZONE: process.env.TIMEZONE || 'America/Sao_Paulo',
  CHECKIN_HOUR: Number(process.env.CHECKIN_HOUR || 14),
  CHECKOUT_HOUR: Number(process.env.CHECKOUT_HOUR || 12),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  ENABLE_STRIPE: process.env.ENABLE_STRIPE === 'true'
};