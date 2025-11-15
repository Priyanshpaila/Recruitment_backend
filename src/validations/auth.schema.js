import { z } from 'zod';

export const registerSchema = z.object({
  phone: z.string().min(6),
  name:  z.string().min(1).max(100),
  email: z.string().email().max(200)
});

export const loginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(4)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(4, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(64, 'New password must be at most 64 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'New password must contain at least one letter and one digit')
});