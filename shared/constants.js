// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  PUBLIC: 'public',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin',
};

// Mood levels
export const MOOD_LEVELS = {
  VERY_NEGATIVE: 'very-negative',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
  POSITIVE: 'positive',
  VERY_POSITIVE: 'very-positive',
};

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Alert status
export const ALERT_STATUS = {
  ACTIVE: 'active',
  ESCALATED: 'escalated',
  RESOLVED: 'resolved',
  FALSE_POSITIVE: 'false-positive',
};

// Appointment status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

// Appointment types
export const APPOINTMENT_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  IN_PERSON: 'in-person',
};

// Assessment types
export const ASSESSMENT_TYPES = {
  PHQ_9: 'phq-9',
  GAD_7: 'gad-7',
  CUSTOM: 'custom',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_SKIP: 0,
  MAX_LIMIT: 100,
};

// Session expiration
export const SESSION = {
  DEFAULT_EXPIRY_DAYS: 7,
  MAX_EXPIRY_DAYS: 30,
};

// WebAuthn settings
export const WEBAUTHN = {
  TIMEOUT: 60000,
  USER_VERIFICATION: 'preferred',
  ATTESTATION: 'none',
};

// API response codes
export const API_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};
