import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const globalLimiter = rateLimit({
  windowMs: env.globalRateWindowMs,
  max: env.globalRateMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later.' }
});
