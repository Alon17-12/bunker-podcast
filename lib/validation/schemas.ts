/**
 * Shared Zod validation schemas.
 * Use these in both API routes and client forms to keep validation consistent.
 */
import { z } from 'zod';

// === Reusable primitives ===
export const uuidSchema = z.string().uuid();
export const isoDateSchema = z.string().datetime();
export const shareTokenSchema = z.string().min(20).max(64);

// === Customer ===
export const customerCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase(),
  whatsapp: z
    .string()
    .regex(/^972\d{8,9}$/, 'WhatsApp must be E.164 format starting with 972'),
  package: z.enum(['photo_only', 'photo_edit', 'retainer']).default('photo_edit'),
  retainer_active: z.boolean().default(false),
  notes: z.string().max(2000).nullable().optional(),
});

export const customerUpdateSchema = customerCreateSchema.partial();

// === Episode ===
export const episodeCreateSchema = z.object({
  customer_id: uuidSchema,
  title: z.string().min(2).max(200),
  episode_number: z.number().int().positive().nullable().optional(),
  recorded_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
});

// === Reel (client-submitted) ===
export const reelInputSchema = z.object({
  title: z.string().min(1).max(100),
  start_time_seconds: z.number().min(0).max(86400),
  end_time_seconds: z.number().min(0).max(86400),
});
// Cross-field rule lives separately so error messages map to the right field:
export const reelInputSchemaValidated = reelInputSchema.refine(
  (r) => r.end_time_seconds > r.start_time_seconds,
  { message: 'end_time must be greater than start_time', path: ['end_time_seconds'] }
);

export const reelsBatchSchema = z.object({
  reels: z.array(reelInputSchemaValidated).min(1).max(20),
});

// === Feedback ===
export const feedbackTimestampedSchema = z.object({
  type: z.literal('timestamped'),
  timestamp_seconds: z.number().min(0).max(86400),
  comment: z.string().min(1).max(2000),
});

export const feedbackGeneralSchema = z.object({
  type: z.literal('general'),
  comment: z.string().min(1).max(5000),
});

export const feedbackItemSchema = z.discriminatedUnion('type', [
  feedbackTimestampedSchema,
  feedbackGeneralSchema,
]);

export const feedbackBatchSchema = z.object({
  items: z.array(feedbackItemSchema).min(1).max(50),
});

// === Submission (closes the round) ===
export const submitFeedbackSchema = z.object({
  approve: z.boolean(),
});

// === Type exports ===
export type CustomerCreate = z.infer<typeof customerCreateSchema>;
export type EpisodeCreate = z.infer<typeof episodeCreateSchema>;
export type ReelInput = z.infer<typeof reelInputSchema>;
export type ReelsBatch = z.infer<typeof reelsBatchSchema>;
export type FeedbackItem = z.infer<typeof feedbackItemSchema>;
export type FeedbackBatch = z.infer<typeof feedbackBatchSchema>;
