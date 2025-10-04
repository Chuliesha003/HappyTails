const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    throw new ValidationError('Validation failed', errorMessages);
  }
  next();
};

/**
 * Common validation chains
 */
const commonValidations = {
  // MongoDB ObjectId validation
  mongoId: (field = 'id') =>
    param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),

  // Email validation
  email: () =>
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

  // Password validation (for future use if needed)
  password: () =>
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter'),

  // Phone number validation
  phoneNumber: () =>
    body('phoneNumber')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage('Please provide a valid phone number'),

  // Pagination validation
  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  // Date validation
  date: (field) =>
    body(field)
      .isISO8601()
      .withMessage(`${field} must be a valid date`),

  // Future date validation
  futureDate: (field) =>
    body(field)
      .isISO8601()
      .withMessage(`${field} must be a valid date`)
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error(`${field} must be in the future`);
        }
        return true;
      }),
};

/**
 * Pet validation rules
 */
const petValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Pet name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Pet name must be between 2 and 50 characters'),
    body('species')
      .notEmpty()
      .withMessage('Species is required')
      .isIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
      .withMessage('Invalid species'),
    body('breed')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Breed must not exceed 50 characters'),
    body('age')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Age must be between 0 and 50'),
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be a positive number'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'unknown'])
      .withMessage('Gender must be male, female, or unknown'),
    validate,
  ],

  update: [
    commonValidations.mongoId('id'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Pet name must be between 2 and 50 characters'),
    body('species')
      .optional()
      .isIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
      .withMessage('Invalid species'),
    body('age')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Age must be between 0 and 50'),
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be a positive number'),
    validate,
  ],

  addMedicalRecord: [
    commonValidations.mongoId('id'),
    body('date')
      .notEmpty()
      .withMessage('Date is required')
      .isISO8601()
      .withMessage('Invalid date format'),
    body('condition')
      .trim()
      .notEmpty()
      .withMessage('Condition is required'),
    body('diagnosis')
      .optional()
      .trim(),
    body('treatment')
      .optional()
      .trim(),
    validate,
  ],
};

/**
 * Appointment validation rules
 */
const appointmentValidation = {
  create: [
    body('vetId')
      .notEmpty()
      .withMessage('Vet ID is required')
      .isMongoId()
      .withMessage('Invalid vet ID'),
    body('petId')
      .notEmpty()
      .withMessage('Pet ID is required')
      .isMongoId()
      .withMessage('Invalid pet ID'),
    body('dateTime')
      .notEmpty()
      .withMessage('Date and time is required')
      .isISO8601()
      .withMessage('Invalid date format')
      .custom((value) => {
        const appointmentDate = new Date(value);
        const now = new Date();
        if (appointmentDate <= now) {
          throw new Error('Appointment must be scheduled for a future date');
        }
        return true;
      }),
    body('duration')
      .optional()
      .isInt({ min: 15, max: 180 })
      .withMessage('Duration must be between 15 and 180 minutes'),
    body('reason')
      .trim()
      .notEmpty()
      .withMessage('Reason for appointment is required')
      .isLength({ max: 500 })
      .withMessage('Reason must not exceed 500 characters'),
    validate,
  ],

  update: [
    commonValidations.mongoId('id'),
    body('dateTime')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Appointment must be scheduled for a future date');
        }
        return true;
      }),
    body('duration')
      .optional()
      .isInt({ min: 15, max: 180 })
      .withMessage('Duration must be between 15 and 180 minutes'),
    validate,
  ],
};

/**
 * Vet validation rules
 */
const vetValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Vet name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    commonValidations.email(),
    commonValidations.phoneNumber(),
    body('clinicName')
      .trim()
      .notEmpty()
      .withMessage('Clinic name is required')
      .isLength({ max: 100 })
      .withMessage('Clinic name must not exceed 100 characters'),
    body('specialization')
      .isArray({ min: 1 })
      .withMessage('At least one specialization is required'),
    body('licenseNumber')
      .trim()
      .notEmpty()
      .withMessage('License number is required'),
    body('location.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    body('consultationFee')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Consultation fee must be a positive number'),
    validate,
  ],

  addReview: [
    commonValidations.mongoId('id'),
    body('rating')
      .notEmpty()
      .withMessage('Rating is required')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Comment must not exceed 500 characters'),
    validate,
  ],
};

/**
 * Article validation rules
 */
const articleValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ min: 100 })
      .withMessage('Content must be at least 100 characters'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['nutrition', 'diseases', 'training', 'grooming', 'behavior', 'general'])
      .withMessage('Invalid category'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    validate,
  ],

  update: [
    commonValidations.mongoId('id'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 100 })
      .withMessage('Content must be at least 100 characters'),
    body('category')
      .optional()
      .isIn(['nutrition', 'diseases', 'training', 'grooming', 'behavior', 'general'])
      .withMessage('Invalid category'),
    validate,
  ],
};

/**
 * Symptom checker validation rules
 */
const symptomValidation = {
  analyze: [
    body('petType')
      .trim()
      .notEmpty()
      .withMessage('Pet type is required')
      .isIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
      .withMessage('Invalid pet type'),
    body('symptoms')
      .trim()
      .notEmpty()
      .withMessage('Symptoms are required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Symptoms must be between 10 and 1000 characters'),
    body('duration')
      .trim()
      .notEmpty()
      .withMessage('Duration is required'),
    body('severity')
      .optional()
      .isIn(['mild', 'moderate', 'severe', 'critical'])
      .withMessage('Invalid severity level'),
    validate,
  ],
};

/**
 * Admin validation rules
 */
const adminValidation = {
  updateUserRole: [
    commonValidations.mongoId('id'),
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['user', 'vet', 'admin'])
      .withMessage('Role must be user, vet, or admin'),
    validate,
  ],
};

/**
 * Sanitization middleware
 */
const sanitize = (req, res, next) => {
  // Remove any fields that start with $ (MongoDB operators)
  const sanitizeObject = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    });
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

module.exports = {
  validate,
  commonValidations,
  petValidation,
  appointmentValidation,
  vetValidation,
  articleValidation,
  symptomValidation,
  adminValidation,
  sanitize,
};
