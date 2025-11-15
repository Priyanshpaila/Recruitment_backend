import 'dotenv/config';

export const env = {
  node: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  mongoUri: process.env.MONGO_URI,
  globalRateWindowMs: Number(process.env.GLOBAL_RATE_WINDOW_MS ?? 15*60*1000),
  globalRateMax: Number(process.env.GLOBAL_RATE_MAX ?? 100),
};
