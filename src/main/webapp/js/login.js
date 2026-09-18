/**
 * Login Page JavaScript
 * Handles user authentication, form validation, and session management
 */

// ============================================================================
// CONFIGURATION AND CONSTANTS
// ============================================================================

const CONFIG = {
    // Validation rules
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 128,
    MAX_USERNAME_LENGTH: 50,
    
    // Email validation regex (RFC 5322 simplified)
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // API endpoints (update these with your actual backend URLs)
    API_ENDPOINTS: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh'
    },
    
    // Redirect URLs
    REDIRECT_URLS: {
        SUCCESS: '/dashboard.html',
        LOGOUT: '/login.html'
    },
    
    // Rate limiting
    MAX_LOGIN_ATTEMPTS: 5,
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes in milliseconds
    
    // Timeouts
    API_TIMEOUT: 30000, // 30 seconds
    SUCCESS_MESSAGE_DURATION: 2000, // 2 seconds
    
    // Session storage keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'auth_token',
        REFRESH_TOKEN: 'refresh_token',
        USER_DATA: 'user_data',
        REMEMBER_ME: 'remember_me',
        LOGIN_ATTEMPTS: 'login_attempts',
        LAST_ATTEMPT_TIME: 'last_attempt_time'
    }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let isSubmitting = false;
let loginAttempts = 0;
let lastAttemptTime = 0;

// DOM Elements (will be initialized on DOMContentLoaded)
let elements = {
    loginForm: null,
    usernameInput: null,
    passwordInput: null,
    loginBtn: null,
    loadingSpinner: null,
    errorMessage: null,
    successMessage: null,
    usernameError: null,
    passwordError: null,
    togglePassword: null,
    rememberMe: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize rate limiting data from localStorage
 */
function initializeRateLimiting() {
    const storedAttempts = localStorage.getItem(CONFIG.STORAGE_KEYS.LOGIN_ATTEMPTS);
    const storedTime = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_ATTEMPT_TIME);
    
    if (storedAttempts && storedTime) {
        const timeDiff = Date.now() - parseInt(storedTime);
        
        // Reset if outside the rate limit window
        if (timeDiff > CONFIG.RATE_LIMIT_WINDOW) {
            loginAttempts = 0;
            lastAttemptTime = 0;
            localStorage.removeItem(CONFIG.STORAGE_KEYS.LOGIN_ATTEMPTS);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.LAST_ATTEMPT_TIME);
        } else {
            loginAttempts = parseInt(storedAttempts);
            lastAttemptTime = parseInt(storedTime);
        }
    }
}



// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate email format using regex pattern
 * @param {string} email - Email address to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return {
            isValid: false,
            message: 'Email or username is required'
        };
    }
    
    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length > CONFIG.MAX_USERNAME_LENGTH) {
        return {
            isValid: false,
            message: `Username must not exceed ${CONFIG.MAX_USERNAME_LENGTH} characters`
        };
    }
    
    // Check if it's an email format (if contains @)
    if (trimmedEmail.includes('@')) {
        if (!CONFIG.EMAIL_REGEX.test(trimmedEmail)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address'
            };
        }
    }
    
    return {
        isValid: true,
        message: ''
    };
}

/**
 * Validate password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
function validatePassword(password) {
    if (!password || password === '') {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }
    
    if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
        return {
            isValid: false,
            message: `Password must be at least ${CONFIG.MIN_PASSWORD_LENGTH} characters long`
        };
    }
    
    if (password.length > CONFIG.MAX_PASSWORD_LENGTH) {
        return {
            isValid: false,
            message: `Password must not exceed ${CONFIG.MAX_PASSWORD_LENGTH} characters`
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

/**
 * Validate all form fields before submission
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
function validateForm() {
    const username = elements.usernameInput.value;
    const password = elements.passwordInput.value;
    
    const usernameValidation = validateEmail(username);
    const passwordValidation = validatePassword(password);
    
    const errors = {
        username: usernameValidation.message,
        password: passwordValidation.message
    };
    
    const isValid = usernameValidation.isValid && passwordValidation.isValid;
    
    return {
        isValid,
        errors
    };
}

/**
 * Validate individual field on blur
 * @param {string} fieldName - Name of the field to validate
 */
function validateField(fieldName) {
    let validation;
    
    if (fieldName === 'username') {
        validation = validateEmail(elements.usernameInput.value);
        updateFieldError('username', validation.message);
    } else if (fieldName === 'password') {
        validation = validatePassword(elements.passwordInput.value);
        updateFieldError('password', validation.message);
    }
}



// ============================================================================
// UI FEEDBACK FUNCTIONS
// ============================================================================

/**
 * Display error message in the error container
 * @param {string} message - Error message to display
 */
function showError(message) {
    if (!elements.errorMessage) return;
    
    const messageText = elements.errorMessage.querySelector('.message-text');
    if (messageText) {
        messageText.textContent = message;
    }
    
    elements.errorMessage.style.display = 'flex';
    elements.successMessage.style.display = 'none';
    
    // Announce to screen readers
    elements.errorMessage.setAttribute('aria-live', 'assertive');
    
    // Scroll to error message if not visible
    elements.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Display success message in the success container
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    if (!elements.successMessage) return;
    
    const messageText = elements.successMessage.querySelector('.message-text');
    if (messageText) {
        messageText.textContent = message;
    }
    
    elements.successMessage.style.display = 'flex';
    elements.errorMessage.style.display = 'none';
    
    // Announce to screen readers
    elements.successMessage.setAttribute('aria-live', 'polite');
}

/**
 * Show loading spinner during API call
 */
function showLoading() {
    if (!elements.loginBtn || !elements.loadingSpinner) return;
    
    elements.loginBtn.disabled = true;
    elements.loginBtn.classList.add('loading');
    elements.loadingSpinner.style.display = 'inline-block';
    
    const btnText = elements.loginBtn.querySelector('.btn-text');
    if (btnText) {
        btnText.textContent = 'Logging in...';
    }
    
    // Update ARIA attributes
    elements.loginBtn.setAttribute('aria-busy', 'true');
    elements.loadingSpinner.setAttribute('aria-hidden', 'false');
}

/**
 * Hide loading spinner after API response
 */
function hideLoading() {
    if (!elements.loginBtn || !elements.loadingSpinner) return;
    
    elements.loginBtn.disabled = false;
    elements.loginBtn.classList.remove('loading');
    elements.loadingSpinner.style.display = 'none';
    
    const btnText = elements.loginBtn.querySelector('.btn-text');
    if (btnText) {
        btnText.textContent = 'Login';
    }
    
    // Update ARIA attributes
    elements.loginBtn.setAttribute('aria-busy', 'false');
    elements.loadingSpinner.setAttribute('aria-hidden', 'true');
}

/**
 * Clear all messages (error and success)
 */
function clearMessages() {
    if (elements.errorMessage) {
        elements.errorMessage.style.display = 'none';
    }
    if (elements.successMessage) {
        elements.successMessage.style.display = 'none';
    }
}

/**
 * Update field-level error message
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function updateFieldError(fieldName, message) {
    const errorElement = elements[`${fieldName}Error`];
    const inputElement = elements[`${fieldName}Input`];
    
    if (!errorElement || !inputElement) return;
    
    if (message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        inputElement.setAttribute('aria-invalid', 'true');
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        inputElement.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Clear all field-level errors
 */
function clearFieldErrors() {
    updateFieldError('username', '');
    updateFieldError('password', '');
}



// ============================================================================
// RATE LIMITING AND SECURITY
// ============================================================================

/**
 * Check if user has exceeded rate limit
 * @returns {Object} - { isBlocked: boolean, remainingTime: number }
 */
function checkRateLimit() {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    
    // Reset if outside the window
    if (timeSinceLastAttempt > CONFIG.RATE_LIMIT_WINDOW) {
        loginAttempts = 0;
        lastAttemptTime = 0;
        localStorage.removeItem(CONFIG.STORAGE_KEYS.LOGIN_ATTEMPTS);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.LAST_ATTEMPT_TIME);
        return { isBlocked: false, remainingTime: 0 };
    }
    
    // Check if exceeded max attempts
    if (loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
        const remainingTime = CONFIG.RATE_LIMIT_WINDOW - timeSinceLastAttempt;
        return { isBlocked: true, remainingTime };
    }
    
    return { isBlocked: false, remainingTime: 0 };
}

/**
 * Increment login attempt counter
 */
function incrementLoginAttempts() {
    loginAttempts++;
    lastAttemptTime = Date.now();
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.LOGIN_ATTEMPTS, loginAttempts.toString());
    localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_ATTEMPT_TIME, lastAttemptTime.toString());
}

/**
 * Reset login attempts after successful login
 */
function resetLoginAttempts() {
    loginAttempts = 0;
    lastAttemptTime = 0;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.LOGIN_ATTEMPTS);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.LAST_ATTEMPT_TIME);
}

/**
 * Format remaining time for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string
 */
function formatRemainingTime(milliseconds) {
    const minutes = Math.ceil(milliseconds / 60000);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}



// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Store authentication token in storage
 * @param {string} token - Authentication token
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
function storeAuthToken(token, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Store refresh token in storage
 * @param {string} token - Refresh token
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
function storeRefreshToken(token, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, token);
}

/**
 * Store user data in storage
 * @param {Object} userData - User data object
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
function storeUserData(userData, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
}

/**
 * Get authentication token from storage
 * @returns {string|null} - Authentication token or null
 */
function getAuthToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN) || 
           sessionStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Clear all session data
 */
function clearSessionData() {
    // Clear from both localStorage and sessionStorage
    const keys = Object.values(CONFIG.STORAGE_KEYS);
    keys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
}

/**
 * Check if user is already logged in
 * @returns {boolean} - True if user has valid token
 */
function isUserLoggedIn() {
    const token = getAuthToken();
    return token !== null && token !== '';
}



// ============================================================================
// CORE LOGIN FUNCTIONS
// ============================================================================

/**
 * Main login handler that prevents default form submission
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Prevent multiple simultaneous submissions
    if (isSubmitting) {
        return;
    }
    
    // Clear previous messages and errors
    clearMessages();
    clearFieldErrors();
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit();
    if (rateLimitCheck.isBlocked) {
        const timeRemaining = formatRemainingTime(rateLimitCheck.remainingTime);
        showError(`Too many login attempts. Please try again in ${timeRemaining}.`);
        return;
    }
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
        // Show field-level errors
        if (validation.errors.username) {
            updateFieldError('username', validation.errors.username);
        }
        if (validation.errors.password) {
            updateFieldError('password', validation.errors.password);
        }
        
        // Show general error message
        showError('Please correct the errors in the form.');
        return;
    }
    
    // Get form values
    const username = sanitizeInput(elements.usernameInput.value.trim());
    const password = elements.passwordInput.value; // Don't sanitize password
    const rememberMe = elements.rememberMe ? elements.rememberMe.checked : false;
    
    // Set submitting flag
    isSubmitting = true;
    
    // Show loading state
    showLoading();
    
    try {
        // Submit login request
        const response = await submitLogin(username, password);
        
        // Handle successful login
        await handleLoginSuccess(response, rememberMe);
        
    } catch (error) {
        // Handle login error
        handleLoginError(error);
        
        // Increment failed attempt counter
        incrementLoginAttempts();
        
    } finally {
        // Reset submitting flag and hide loading
        isSubmitting = false;
        hideLoading();
    }
}

/**
 * Make API call to backend login endpoint
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise<Object>} - Response data from server
 */
async function submitLogin(username, password) {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);
    
    try {
        const response = await fetch(CONFIG.API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Parse response
        const data = await response.json();
        
        // Check if response is successful
        if (!response.ok) {
            // Throw error with server message or default message
            const error = new Error(data.message || 'Login failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }
        
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Handle abort (timeout)
        if (error.name === 'AbortError') {
            const timeoutError = new Error('Request timeout. Please try again.');
            timeoutError.status = 408;
            throw timeoutError;
        }
        
        // Handle network errors
        if (error instanceof TypeError) {
            const networkError = new Error('Network error. Please check your connection.');
            networkError.status = 0;
            throw networkError;
        }
        
        // Re-throw other errors
        throw error;
    }
}

/**
 * Process successful login response
 * @param {Object} response - Response data from server
 * @param {boolean} rememberMe - Whether to persist session
 */
async function handleLoginSuccess(response, rememberMe) {
    // Reset login attempts
    resetLoginAttempts();
    
    // Store authentication data
    if (response.token || response.accessToken) {
        const token = response.token || response.accessToken;
        storeAuthToken(token, rememberMe);
    }
    
    if (response.refreshToken) {
        storeRefreshToken(response.refreshToken, rememberMe);
    }
    
    if (response.user || response.userData) {
        const userData = response.user || response.userData;
        storeUserData(userData, rememberMe);
    }
    
    // Store remember me preference
    if (rememberMe) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.REMEMBER_ME, 'true');
    }
    
    // Show success message
    showSuccess('Login successful! Redirecting...');
    
    // Clear password field for security
    elements.passwordInput.value = '';
    
    // Redirect after short delay
    setTimeout(() => {
        window.location.href = CONFIG.REDIRECT_URLS.SUCCESS;
    }, CONFIG.SUCCESS_MESSAGE_DURATION);
}

/**
 * Process login failures and display appropriate messages
 * @param {Error} error - Error object from failed login
 */
function handleLoginError(error) {
    let errorMessage = 'An error occurred during login. Please try again.';
    
    // Handle different error types
    if (error.status === 401) {
        errorMessage = 'Invalid username or password. Please try again.';
    } else if (error.status === 400) {
        errorMessage = error.message || 'Invalid request. Please check your input.';
    } else if (error.status === 403) {
        errorMessage = 'Account is locked or suspended. Please contact support.';
    } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
    } else if (error.status === 500 || error.status === 502 || error.status === 503) {
        errorMessage = 'Server error. Please try again later.';
    } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.status === 408) {
        errorMessage = error.message;
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    // Show error message
    showError(errorMessage);
    
    // Clear password field after failed attempt
    if (elements.passwordInput) {
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
    }
    
    // Log error for debugging (remove in production)
    console.error('Login error:', error);
}



// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle password visibility toggle
 */
function handlePasswordToggle() {
    if (!elements.passwordInput || !elements.togglePassword) return;
    
    const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
    elements.passwordInput.type = type;
    
    // Update button text/icon
    const eyeIcon = elements.togglePassword.querySelector('.eye-icon');
    if (eyeIcon) {
        eyeIcon.textContent = type === 'password' ? '👁' : '🙈';
    }
    
    // Update ARIA label
    elements.togglePassword.setAttribute(
        'aria-label',
        type === 'password' ? 'Show password' : 'Hide password'
    );
}

/**
 * Handle input field focus - clear field errors
 * @param {string} fieldName - Name of the field
 */
function handleFieldFocus(fieldName) {
    updateFieldError(fieldName, '');
}

/**
 * Handle input field blur - validate field
 * @param {string} fieldName - Name of the field
 */
function handleFieldBlur(fieldName) {
    const value = elements[`${fieldName}Input`].value;
    
    // Only validate if field has value
    if (value && value.trim() !== '') {
        validateField(fieldName);
    }
}

/**
 * Handle Enter key press in form fields
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleEnterKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        elements.loginForm.dispatchEvent(new Event('submit'));
    }
}

/**
 * Clear messages when user starts typing
 */
function handleInputChange() {
    clearMessages();
}



// ============================================================================
// INITIALIZATION AND EVENT LISTENERS
// ============================================================================

/**
 * Initialize DOM elements
 */
function initializeElements() {
    elements.loginForm = document.getElementById('loginForm');
    elements.usernameInput = document.getElementById('username');
    elements.passwordInput = document.getElementById('password');
    elements.loginBtn = document.getElementById('loginBtn');
    elements.loadingSpinner = document.getElementById('loadingSpinner');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.successMessage = document.getElementById('successMessage');
    elements.usernameError = document.getElementById('usernameError');
    elements.passwordError = document.getElementById('passwordError');
    elements.togglePassword = document.getElementById('togglePassword');
    elements.rememberMe = document.getElementById('rememberMe');
}

/**
 * Attach event listeners to form elements
 */
function attachEventListeners() {
    // Form submit event
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }
    
    // Username field events
    if (elements.usernameInput) {
        elements.usernameInput.addEventListener('blur', () => handleFieldBlur('username'));
        elements.usernameInput.addEventListener('focus', () => handleFieldFocus('username'));
        elements.usernameInput.addEventListener('input', handleInputChange);
        elements.usernameInput.addEventListener('keypress', handleEnterKey);
    }
    
    // Password field events
    if (elements.passwordInput) {
        elements.passwordInput.addEventListener('blur', () => handleFieldBlur('password'));
        elements.passwordInput.addEventListener('focus', () => handleFieldFocus('password'));
        elements.passwordInput.addEventListener('input', handleInputChange);
        elements.passwordInput.addEventListener('keypress', handleEnterKey);
    }
    
    // Password toggle button
    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('click', handlePasswordToggle);
    }
    
    // Prevent form submission on Enter in toggle button
    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handlePasswordToggle();
            }
        });
    }
}

/**
 * Check if user is already logged in and redirect
 */
function checkExistingSession() {
    if (isUserLoggedIn()) {
        // User is already logged in, redirect to dashboard
        window.location.href = CONFIG.REDIRECT_URLS.SUCCESS;
    }
}

/**
 * Restore remember me state
 */
function restoreRememberMeState() {
    if (elements.rememberMe) {
        const rememberMeValue = localStorage.getItem(CONFIG.STORAGE_KEYS.REMEMBER_ME);
        if (rememberMeValue === 'true') {
            elements.rememberMe.checked = true;
        }
    }
}

/**
 * Initialize the login page
 */
function initialize() {
    // Initialize DOM elements
    initializeElements();
    
    // Check for missing required elements
    if (!elements.loginForm || !elements.usernameInput || !elements.passwordInput) {
        console.error('Required form elements not found');
        return;
    }
    
    // Initialize rate limiting
    initializeRateLimiting();
    
    // Check existing session
    checkExistingSession();
    
    // Restore remember me state
    restoreRememberMeState();
    
    // Attach event listeners
    attachEventListeners();
    
    // Focus on username field
    if (elements.usernameInput) {
        elements.usernameInput.focus();
    }
    
    console.log('Login page initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    // DOM is already ready
    initialize();
}

// ============================================================================
// EXPORT FOR TESTING (if using modules)
// ============================================================================

// Uncomment if using ES6 modules
/*
export {
    validateEmail,
    validatePassword,
    validateForm,
    showError,
    showSuccess,
    showLoading,
    hideLoading,
    handleLogin,
    submitLogin,
    handleLoginSuccess,
    handleLoginError
};
*/

