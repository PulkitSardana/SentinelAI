import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the exact schema our environment must follow
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    ML_SERVICE_URL: z.string().url(),
});

// Validate the current process.env against our schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

// Export the strictly typed environment object
export const env = parsedEnv.data;
