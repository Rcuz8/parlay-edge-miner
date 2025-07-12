import { z } from 'zod';
import pino from 'pino';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  OPENAI_API_KEY: z.string(),
  ODDS_API_KEY: z.string(),
  TWILIO_SID: z.string(),
  TWILIO_TOKEN: z.string(),
  TWILIO_FROM: z.string(),
  TWILIO_TO: z.string(),
  LANGCHAIN_TRACING: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

export const getConfig = (): Env => envSchema.parse(process.env);

export const logger = pino({
  name: 'parlay-edge-miner',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

/**
 * Minimal LangSmith tracing helper to avoid heavy deps.
 */
export const trace = (name: string, details: Record<string, unknown>): void => {
  if (process.env.LANGCHAIN_TRACING === 'true') {
    logger.debug({ trace: name, details });
  }
};