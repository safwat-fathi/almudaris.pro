/**
 * Groups feature configuration constants.
 * Centralized to avoid hardcoding across the codebase.
 */
export const GROUPS_CONFIG = {
  /** Maximum number of recurring group instances per series (MVP default) */
  MAX_RECURRING_INSTANCES: 24,

  /** Supported recurrence patterns */
  RECURRENCE_PATTERNS: ['WEEKLY'] as const,
} as const;

export type RecurrencePattern =
  (typeof GROUPS_CONFIG.RECURRENCE_PATTERNS)[number];
