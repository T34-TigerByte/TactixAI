import type { ZodSchema } from 'zod';

/**
 * Validate API Response format with Zod Schema at runtime.
 *
 * DEV  : throw ZodError immediately — catches schema mismatches early during development.
 * PROD : console.warn + return raw data — keeps the app alive while logging the issue.
 *
 * @param schema  Zod api schema for response validation
 * @param data    raw response data
 * @param context API context for warning console message (For Debug)
 */
export function parseResponse<T>(schema: ZodSchema<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    if (import.meta.env.DEV) {
      throw new Error(
        `[API Validation Failed] ${context}\n${JSON.stringify(result.error.flatten(), null, 2)}`
      );
    }

    console.warn(`[API Validation Failed] ${context}`, result.error.flatten());
    return data as T;
  }

  return result.data;
}