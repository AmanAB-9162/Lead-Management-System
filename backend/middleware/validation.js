const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation rules
const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  handleValidationErrors
];

// User login validation rules
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Lead validation rules
const validateLead = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot be more than 50 characters'),
  
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot be more than 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone cannot be more than 20 characters'),
  
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot be more than 100 characters'),
  
  body('city')
    .optional()
    .isLength({ max: 50 })
    .withMessage('City cannot be more than 50 characters'),
  
  body('state')
    .optional()
    .isLength({ max: 50 })
    .withMessage('State cannot be more than 50 characters'),
  
  body('source')
    .isIn(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'])
    .withMessage('Source must be one of: website, facebook_ads, google_ads, referral, events, other'),
  
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost', 'won'])
    .withMessage('Status must be one of: new, contacted, qualified, lost, won'),
  
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  
  body('lead_value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Lead value cannot be negative'),
  
  body('is_qualified')
    .optional()
    .isBoolean()
    .withMessage('is_qualified must be a boolean'),
  
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateLogin,
  validateLead,
  handleValidationErrors
};
