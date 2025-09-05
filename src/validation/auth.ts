import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  cycle: z.string().min(1).max(100),
  birthDate: z.string().min(1),
});

export const precheckSchema = z.object({});

export const loginSchema = z.object({
  password: z.union([z.string().min(1).max(100), z.number()]).transform((val) => val.toString()),
});
