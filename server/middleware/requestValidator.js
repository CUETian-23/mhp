const { body, validationResult, param } = require('express-validator');

// Validation middleware helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'public', 'professional', 'admin'])
    .withMessage('Invalid role'),
  validate,
];

const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

// Journal entry validation
const journalEntryValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),
  body('mood')
    .optional()
    .isIn(['very-negative', 'negative', 'neutral', 'positive', 'very-positive'])
    .withMessage('Invalid mood value'),
  body('tags')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 50);
      }
      return true;
    })
    .withMessage('Tags must be strings with max 50 characters'),
  validate,
];

// Mood record validation
const moodRecordValidation = [
  body('mood')
    .isIn(['very-negative', 'negative', 'neutral', 'positive', 'very-positive'])
    .withMessage('Invalid mood value'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be between 1 and 10'),
  body('factors')
    .optional()
    .isArray()
    .withMessage('Factors must be an array'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  validate,
];

// ID parameter validation
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

// User profile validation
const profileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Invalid phone number format'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  journalEntryValidation,
  moodRecordValidation,
  idValidation,
  profileValidation,
};
