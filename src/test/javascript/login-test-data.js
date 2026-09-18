/**
 * Test Data for UI Login Functionality
 * 
 * This file contains all test data fixtures used in the login functionality tests.
 * It includes valid credentials, invalid inputs, mock API responses, and expected error messages.
 * 
 * @module login-test-data
 * @version 1.0.0
 * @author Indian Bank Development Team
 * @created 2024
 */

// ============================================================================
// VALID USER CREDENTIALS
// ============================================================================

/**
 * Valid user credentials for positive test cases
 * @typedef {Object} ValidUser
 * @property {string} username - Valid username or email
 * @property {string} password - Valid password
 * @property {string} description - Description of the test user
 */

/**
 * Collection of valid test users
 * @type {ValidUser[]}
 */
export const VALID_USERS = [
  {
    username: 'testuser@indianbank.com',
    password: 'Test@123456',
    description: 'Standard test user with email format'
  },
  {
    username: 'admin@indianbank.com',
    password: 'Admin@2024',
    description: 'Admin user for elevated permissions testing'
  },
  {
    username: 'john.doe',
    password: 'SecurePass123!',
    description: 'User with username (non-email format)'
  },
  {
    username: 'customer.service@indianbank.com',
    password: 'Customer@Service2024',
    description: 'Customer service representative account'
  },
  {
    username: 'branch.manager',
    password: 'Manager@Branch123',
    description: 'Branch manager account'
  }
];

// ============================================================================
// INVALID CREDENTIALS
// ============================================================================

/**
 * Invalid credentials for negative test cases
 * @typedef {Object} InvalidCredential
 * @property {string} username - Username (may be valid or invalid)
 * @property {string} password - Password (may be valid or invalid)
 * @property {string} description - Description of the test case
 * @property {string} expectedError - Expected error message
 */

/**
 * Collection of invalid credentials
 * @type {InvalidCredential[]}
 */
export const INVALID_CREDENTIALS = [
  {
    username: 'testuser@indianbank.com',
    password: 'WrongPassword123',
    description: 'Valid username with incorrect password',
    expectedError: 'Invalid username or password'
  },
  {
    username: 'nonexistent@indianbank.com',
    password: 'Test@123456',
    description: 'Non-existent user account',
    expectedError: 'Invalid username or password'
  },
  {
    username: 'locked.user@indianbank.com',
    password: 'Test@123456',
    description: 'Locked user account',
    expectedError: 'Account is locked. Please contact support.'
  },
  {
    username: 'expired.user@indianbank.com',
    password: 'Test@123456',
    description: 'Expired user account',
    expectedError: 'Account has expired. Please contact support.'
  },
  {
    username: 'inactive@indianbank.com',
    password: 'Test@123456',
    description: 'Inactive user account',
    expectedError: 'Account is inactive. Please contact support.'
  }
];

// ============================================================================
// MALFORMED INPUT DATA
// ============================================================================

/**
 * Malformed input data for validation testing
 * @typedef {Object} MalformedInput
 * @property {string} username - Malformed username
 * @property {string} password - Malformed password
 * @property {string} description - Description of the malformed input
 * @property {string} expectedError - Expected validation error
 */

/**
 * Collection of malformed inputs
 * @type {MalformedInput[]}
 */
export const MALFORMED_INPUTS = [
  {
    username: '',
    password: 'Test@123456',
    description: 'Empty username field',
    expectedError: 'Username is required'
  },
  {
    username: 'testuser@indianbank.com',
    password: '',
    description: 'Empty password field',
    expectedError: 'Password is required'
  },
  {
    username: '',
    password: '',
    description: 'Both fields empty',
    expectedError: 'Username is required'
  },
  {
    username: 'invalid-email',
    password: 'Test@123456',
    description: 'Invalid email format (missing @)',
    expectedError: 'Please enter a valid email address or username'
  },
  {
    username: 'test@',
    password: 'Test@123456',
    description: 'Invalid email format (missing domain)',
    expectedError: 'Please enter a valid email address or username'
  },
  {
    username: '@indianbank.com',
    password: 'Test@123456',
    description: 'Invalid email format (missing local part)',
    expectedError: 'Please enter a valid email address or username'
  },
  {
    username: 'testuser@indianbank.com',
    password: '12345',
    description: 'Password too short (less than 6 characters)',
    expectedError: 'Password must be at least 6 characters long'
  },
  {
    username: 'testuser@indianbank.com',
    password: 'a'.repeat(129),
    description: 'Password too long (more than 128 characters)',
    expectedError: 'Password must not exceed 128 characters'
  },
  {
    username: 'a'.repeat(51) + '@indianbank.com',
    password: 'Test@123456',
    description: 'Username exceeds maximum length (50 characters)',
    expectedError: 'Username must not exceed 50 characters'
  },
  {
    username: '   ',
    password: 'Test@123456',
    description: 'Username with only whitespace',
    expectedError: 'Username is required'
  },
  {
    username: 'testuser@indianbank.com',
    password: '   ',
    description: 'Password with only whitespace',
    expectedError: 'Password is required'
  }
];

// ============================================================================
// SPECIAL CHARACTERS AND EDGE CASES
// ============================================================================

/**
 * Special character test cases
 * @type {Object[]}
 */
export const SPECIAL_CHARACTER_INPUTS = [
  {
    username: "test'user@indianbank.com",
    password: 'Test@123456',
    description: 'Username with single quote (SQL injection attempt)',
    expectedError: null // Should be sanitized, not rejected
  },
  {
    username: 'test"user@indianbank.com',
    password: 'Test@123456',
    description: 'Username with double quote',
    expectedError: null
  },
  {
    username: 'test<script>alert("xss")</script>@indianbank.com',
    password: 'Test@123456',
    description: 'Username with XSS attempt',
    expectedError: null // Should be sanitized
  },
  {
    username: 'testuser@indianbank.com',
    password: '<script>alert("xss")</script>',
    description: 'Password with XSS attempt',
    expectedError: null // Should be sanitized
  },
  {
    username: "admin' OR '1'='1",
    password: 'anything',
    description: 'SQL injection attempt in username',
    expectedError: 'Invalid username or password'
  },
  {
    username: 'testuser@indianbank.com',
    password: "' OR '1'='1",
    description: 'SQL injection attempt in password',
    expectedError: 'Invalid username or password'
  },
  {
    username: 'test.user+tag@indianbank.com',
    password: 'Test@123456',
    description: 'Valid email with plus sign and dot',
    expectedError: null
  },
  {
    username: 'test_user-123@indianbank.com',
    password: 'Test@123456',
    description: 'Valid email with underscore and hyphen',
    expectedError: null
  }
];

// ============================================================================
// MOCK API RESPONSES
// ============================================================================

/**
 * Mock successful login response
 * @typedef {Object} SuccessResponse
 * @property {boolean} success - Success status
 * @property {string} message - Success message
 * @property {Object} data - Response data
 */

/**
 * Successful login response
 * @type {SuccessResponse}
 */
export const MOCK_SUCCESS_RESPONSE = {
  success: true,
  message: 'Login successful',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJ0ZXN0dXNlckBpbmRpYW5iYW5rLmNvbSIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxNjE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: 'refresh_token_abc123xyz789',
    user: {
      id: '1234567890',
      username: 'testuser@indianbank.com',
      email: 'testuser@indianbank.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'customer',
      lastLogin: new Date().toISOString(),
      accountStatus: 'active'
    },
    expiresIn: 3600,
    redirectUrl: '/dashboard'
  }
};

/**
 * Mock error responses for different scenarios
 * @type {Object}
 */
export const MOCK_ERROR_RESPONSES = {
  INVALID_CREDENTIALS: {
    success: false,
    message: 'Invalid username or password',
    error: {
      code: 'AUTH_001',
      type: 'AUTHENTICATION_ERROR',
      details: 'The provided credentials are incorrect'
    },
    statusCode: 401
  },
  
  ACCOUNT_LOCKED: {
    success: false,
    message: 'Account is locked. Please contact support.',
    error: {
      code: 'AUTH_002',
      type: 'ACCOUNT_LOCKED',
      details: 'Account has been locked due to multiple failed login attempts',
      lockoutDuration: 900 // 15 minutes in seconds
    },
    statusCode: 403
  },
  
  SERVER_ERROR: {
    success: false,
    message: 'An error occurred. Please try again later.',
    error: {
      code: 'SYS_001',
      type: 'INTERNAL_SERVER_ERROR',
      details: 'Internal server error occurred'
    },
    statusCode: 500
  },
  
  SERVICE_UNAVAILABLE: {
    success: false,
    message: 'Service temporarily unavailable. Please try again later.',
    error: {
      code: 'SYS_002',
      type: 'SERVICE_UNAVAILABLE',
      details: 'Service is currently under maintenance'
    },
    statusCode: 503
  },
  
  NETWORK_ERROR: {
    success: false,
    message: 'Network error. Please check your connection.',
    error: {
      code: 'NET_001',
      type: 'NETWORK_ERROR',
      details: 'Failed to connect to the server'
    },
    statusCode: 0
  },
  
  TIMEOUT_ERROR: {
    success: false,
    message: 'Request timeout. Please try again.',
    error: {
      code: 'NET_002',
      type: 'TIMEOUT_ERROR',
      details: 'Request took too long to complete'
    },
    statusCode: 408
  },
  
  VALIDATION_ERROR: {
    success: false,
    message: 'Validation failed',
    error: {
      code: 'VAL_001',
      type: 'VALIDATION_ERROR',
      details: 'One or more fields contain invalid data',
      fields: {
        username: 'Username is required',
        password: 'Password must be at least 6 characters'
      }
    },
    statusCode: 400
  },
  
  RATE_LIMIT_EXCEEDED: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
    error: {
      code: 'AUTH_003',
      type: 'RATE_LIMIT_EXCEEDED',
      details: 'Maximum login attempts exceeded',
      retryAfter: 900 // 15 minutes in seconds
    },
    statusCode: 429
  }
};

// ============================================================================
// EXPECTED ERROR MESSAGES
// ============================================================================

/**
 * Expected validation error messages
 * @type {Object}
 */
export const VALIDATION_ERROR_MESSAGES = {
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_INVALID: 'Please enter a valid email address or username',
  USERNAME_TOO_LONG: 'Username must not exceed 50 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORD_TOO_LONG: 'Password must not exceed 128 characters',
  INVALID_CREDENTIALS: 'Invalid username or password',
  ACCOUNT_LOCKED: 'Account is locked. Please contact support.',
  ACCOUNT_EXPIRED: 'Account has expired. Please contact support.',
  ACCOUNT_INACTIVE: 'Account is inactive. Please contact support.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  RATE_LIMIT: 'Too many login attempts. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.'
};

/**
 * Expected success messages
 * @type {Object}
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  VALIDATION_PASSED: 'Form validation passed'
};

// ============================================================================
// BOUNDARY TEST VALUES
// ============================================================================

/**
 * Boundary test values for validation
 * @type {Object}
 */
export const BOUNDARY_VALUES = {
  USERNAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    VALID_MIN: 'a@b.c', // Minimum valid email
    VALID_MAX: 'a'.repeat(40) + '@test.com', // Maximum valid username
    INVALID_TOO_LONG: 'a'.repeat(51) + '@test.com'
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    VALID_MIN: '123456', // Minimum valid password
    VALID_MAX: 'a'.repeat(128), // Maximum valid password
    INVALID_TOO_SHORT: '12345',
    INVALID_TOO_LONG: 'a'.repeat(129)
  }
};

// ============================================================================
// RATE LIMITING TEST DATA
// ============================================================================

/**
 * Rate limiting configuration for testing
 * @type {Object}
 */
export const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes in milliseconds
  ATTEMPT_WINDOW: 900000 // 15 minutes in milliseconds
};

// ============================================================================
// TIMEOUT TEST VALUES
// ============================================================================

/**
 * Timeout values for testing
 * @type {Object}
 */
export const TIMEOUT_VALUES = {
  API_TIMEOUT: 30000, // 30 seconds
  SHORT_TIMEOUT: 1000, // 1 second for testing
  LONG_TIMEOUT: 60000 // 1 minute
};

// ============================================================================
// DOM ELEMENT IDS (for test reference)
// ============================================================================

/**
 * DOM element IDs used in the login form
 * @type {Object}
 */
export const DOM_ELEMENTS = {
  FORM: 'loginForm',
  USERNAME_INPUT: 'username',
  PASSWORD_INPUT: 'password',
  LOGIN_BUTTON: 'loginBtn',
  ERROR_MESSAGE: 'errorMessage',
  SUCCESS_MESSAGE: 'successMessage',
  LOADING_SPINNER: 'loadingSpinner',
  PASSWORD_TOGGLE: 'togglePassword',
  REMEMBER_ME: 'rememberMe',
  USERNAME_ERROR: 'usernameError',
  PASSWORD_ERROR: 'passwordError'
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * LocalStorage and SessionStorage keys
 * @type {Object}
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  REMEMBER_ME: 'rememberMe',
  LOGIN_ATTEMPTS: 'loginAttempts',
  LAST_ATTEMPT_TIME: 'lastAttemptTime'
};

// ============================================================================
// API ENDPOINTS (for mocking)
// ============================================================================

/**
 * API endpoints used in login functionality
 * @type {Object}
 */
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  VALIDATE_TOKEN: '/api/auth/validate'
};

// ============================================================================
// HELPER FUNCTIONS FOR TEST DATA
// ============================================================================

/**
 * Generate a random valid user for testing
 * @returns {ValidUser} Random valid user object
 */
export function getRandomValidUser() {
  return VALID_USERS[Math.floor(Math.random() * VALID_USERS.length)];
}

/**
 * Generate a random invalid credential for testing
 * @returns {InvalidCredential} Random invalid credential object
 */
export function getRandomInvalidCredential() {
  return INVALID_CREDENTIALS[Math.floor(Math.random() * INVALID_CREDENTIALS.length)];
}

/**
 * Generate a random malformed input for testing
 * @returns {MalformedInput} Random malformed input object
 */
export function getRandomMalformedInput() {
  return MALFORMED_INPUTS[Math.floor(Math.random() * MALFORMED_INPUTS.length)];
}

/**
 * Create a custom mock response
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Custom mock response
 */
export function createMockResponse(success, message, data = null, statusCode = 200) {
  return {
    success,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a mock error response
 * @param {string} errorType - Type of error (key from MOCK_ERROR_RESPONSES)
 * @returns {Object} Mock error response
 */
export function getMockErrorResponse(errorType) {
  return MOCK_ERROR_RESPONSES[errorType] || MOCK_ERROR_RESPONSES.SERVER_ERROR;
}

// ============================================================================
// EXPORT ALL TEST DATA
// ============================================================================

export default {
  VALID_USERS,
  INVALID_CREDENTIALS,
  MALFORMED_INPUTS,
  SPECIAL_CHARACTER_INPUTS,
  MOCK_SUCCESS_RESPONSE,
  MOCK_ERROR_RESPONSES,
  VALIDATION_ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  BOUNDARY_VALUES,
  RATE_LIMIT_CONFIG,
  TIMEOUT_VALUES,
  DOM_ELEMENTS,
  STORAGE_KEYS,
  API_ENDPOINTS,
  getRandomValidUser,
  getRandomInvalidCredential,
  getRandomMalformedInput,
  createMockResponse,
  getMockErrorResponse
};

