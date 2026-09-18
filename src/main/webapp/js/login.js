/**
 * Login Page JavaScript
 * Handles form validation, submission, and UI interactions
 */

// Configuration
const CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_USERNAME_LENGTH: 50,
  MAX_PASSWORD_LENGTH: 128,
  API_TIMEOUT: 3000,
  REMEMBER_ME_KEY: 'rememberedUsername',
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// DOM Elements
let elements = {};

// State
const state = {
  isSubmitting: false,
  validationErrors: {}
};

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  initializeEventListeners();
  loadRememberedUsername();
});

/**
 * Cache DOM elements for better performance
 */
function initializeElements() {
  elements = {
    form: document.getElementById('loginForm'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('loginBtn'),
    errorMessage: document.getElementById('errorMessage'),
    successMessage: document.getElementById('successMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    usernameError: document.getElementById('usernameError'),
    passwordError: document.getElementById('passwordError'),
    passwordToggle: document.getElementById('passwordToggle'),
    rememberMeCheckbox: document.getElementById('rememberMe')
  };
}

/**
 * Set up all event listeners
 */
function initializeEventListeners() {
  // Form submission
  elements.form.addEventListener('submit', handleFormSubmit);

  // Real-time validation
  elements.usernameInput.addEventListener('blur', () => validateField('username'));
  elements.passwordInput.addEventListener('blur', () => validateField('password'));

  // Clear errors on input
  elements.usernameInput.addEventListener('input', () => clearFieldError('username'));
  elements.passwordInput.addEventListener('input', () => clearFieldError('password'));

  // Password visibility toggle
  elements.passwordToggle.addEventListener('click', togglePasswordVisibility);

  // Keyboard accessibility for password toggle
  elements.passwordToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePasswordVisibility();
    }
  });
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  // Prevent double submission
  if (state.isSubmitting) {
    return;
  }

  // Clear previous messages
  hideMessages();

  // Validate all fields
  const isValid = validateForm();

  if (!isValid) {
    showError('Please correct the errors before submitting.');
    return;
  }

  // Get form data
  const formData = {
    username: elements.usernameInput.value.trim(),
    password: elements.passwordInput.value,
    rememberMe: elements.rememberMeCheckbox.checked
  };

  // Submit the form
  await submitLogin(formData);
}

/**
 * Validate the entire form
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
  const usernameValid = validateField('username');
  const passwordValid = validateField('password');

  return usernameValid && passwordValid;
}

/**
 * Validate a specific field
 * @param {string} fieldName - Name of the field to validate
 * @returns {boolean} - True if field is valid
 */
function validateField(fieldName) {
  let isValid = true;
  let errorMessage = '';

  if (fieldName === 'username') {
    const username = elements.usernameInput.value.trim();

    if (!username) {
      isValid = false;
      errorMessage = 'Username or email is required.';
    } else if (username.length > CONFIG.MAX_USERNAME_LENGTH) {
      isValid = false;
      errorMessage = `Username must not exceed ${CONFIG.MAX_USERNAME_LENGTH} characters.`;
    } else if (username.includes('@') && !CONFIG.EMAIL_REGEX.test(username)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    }

    if (!isValid) {
      showFieldError('username', errorMessage);
      elements.usernameInput.classList.add('error');
    } else {
      clearFieldError('username');
      elements.usernameInput.classList.remove('error');
    }
  }

  if (fieldName === 'password') {
    const password = elements.passwordInput.value;

    if (!password) {
      isValid = false;
      errorMessage = 'Password is required.';
    } else if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
      isValid = false;
      errorMessage = `Password must be at least ${CONFIG.MIN_PASSWORD_LENGTH} characters.`;
    } else if (password.length > CONFIG.MAX_PASSWORD_LENGTH) {
      isValid = false;
      errorMessage = `Password must not exceed ${CONFIG.MAX_PASSWORD_LENGTH} characters.`;
    }

    if (!isValid) {
      showFieldError('password', errorMessage);
      elements.passwordInput.classList.add('error');
    } else {
      clearFieldError('password');
      elements.passwordInput.classList.remove('error');
    }
  }

  state.validationErrors[fieldName] = !isValid;
  return isValid;
}

/**
 * Show field-specific error message
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldName, message) {
  const errorElement = elements[`${fieldName}Error`];
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

/**
 * Clear field-specific error message
 * @param {string} fieldName - Name of the field
 */
function clearFieldError(fieldName) {
  const errorElement = elements[`${fieldName}Error`];
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  const inputElement = elements[`${fieldName}Input`];
  if (inputElement) {
    inputElement.classList.remove('error');
  }

  state.validationErrors[fieldName] = false;
}

/**
 * Submit login credentials
 * @param {Object} formData - Form data containing username, password, and rememberMe
 */
async function submitLogin(formData) {
  try {
    // Set submitting state
    setSubmittingState(true);

    // Simulate API call (replace with actual API endpoint)
    const response = await mockLoginAPI(formData);

    if (response.success) {
      handleLoginSuccess(formData);
    } else {
      handleLoginError(response.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    handleLoginError('An unexpected error occurred. Please try again later.');
    console.error('Login error:', error);
  } finally {
    setSubmittingState(false);
  }
}

/**
 * Mock API call for login (replace with actual API integration)
 * @param {Object} formData - Login credentials
 * @returns {Promise<Object>} - API response
 */
function mockLoginAPI(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation - replace with actual API call
      // Example: fetch('/api/login', { method: 'POST', body: JSON.stringify(formData) })

      // For demo purposes, accept any username with password length >= 6
      if (formData.password.length >= CONFIG.MIN_PASSWORD_LENGTH) {
        resolve({
          success: true,
          message: 'Login successful!',
          user: {
            username: formData.username
          }
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid username or password.'
        });
      }
    }, CONFIG.API_TIMEOUT);
  });
}

/**
 * Handle successful login
 * @param {Object} formData - Form data
 */
function handleLoginSuccess(formData) {
  // Handle remember me
  if (formData.rememberMe) {
    localStorage.setItem(CONFIG.REMEMBER_ME_KEY, formData.username);
  } else {
    localStorage.removeItem(CONFIG.REMEMBER_ME_KEY);
  }

  // Show success message
  showSuccess('Login successful! Redirecting...');

  // Clear form
  elements.form.reset();

  // Simulate redirect (replace with actual redirect)
  setTimeout(() => {
    // window.location.href = '/dashboard';
    console.log('Redirecting to dashboard...');
  }, 1500);
}

/**
 * Handle login error
 * @param {string} message - Error message
 */
function handleLoginError(message) {
  showError(message);

  // Focus on username field for retry
  elements.usernameInput.focus();
}

/**
 * Set submitting state (loading)
 * @param {boolean} isSubmitting - Whether form is submitting
 */
function setSubmittingState(isSubmitting) {
  state.isSubmitting = isSubmitting;

  if (isSubmitting) {
    elements.loginBtn.disabled = true;
    elements.loadingSpinner.classList.add('show');
    elements.loginBtn.setAttribute('aria-busy', 'true');
  } else {
    elements.loginBtn.disabled = false;
    elements.loadingSpinner.classList.remove('show');
    elements.loginBtn.setAttribute('aria-busy', 'false');
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  hideMessages();
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.add('show');
  elements.errorMessage.setAttribute('role', 'alert');

  // Announce to screen readers
  announceToScreenReader(message, 'assertive');
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  hideMessages();
  elements.successMessage.textContent = message;
  elements.successMessage.classList.add('show');
  elements.successMessage.setAttribute('role', 'status');

  // Announce to screen readers
  announceToScreenReader(message, 'polite');
}

/**
 * Hide all messages
 */
function hideMessages() {
  elements.errorMessage.classList.remove('show');
  elements.successMessage.classList.remove('show');
  elements.errorMessage.textContent = '';
  elements.successMessage.textContent = '';
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
  const isPassword = elements.passwordInput.type === 'password';

  if (isPassword) {
    elements.passwordInput.type = 'text';
    elements.passwordToggle.innerHTML = '👁️‍🗨️';
    elements.passwordToggle.setAttribute('aria-label', 'Hide password');
  } else {
    elements.passwordInput.type = 'password';
    elements.passwordToggle.innerHTML = '👁️';
    elements.passwordToggle.setAttribute('aria-label', 'Show password');
  }
}

/**
 * Load remembered username from localStorage
 */
function loadRememberedUsername() {
  const rememberedUsername = localStorage.getItem(CONFIG.REMEMBER_ME_KEY);

  if (rememberedUsername) {
    elements.usernameInput.value = rememberedUsername;
    elements.rememberMeCheckbox.checked = true;
  }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateField,
    validateForm,
    showError,
    showSuccess,
    hideMessages,
    togglePasswordVisibility,
    handleFormSubmit,
    CONFIG
  };
}

