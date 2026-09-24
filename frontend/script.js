// ============================================
// CONSTANTS AND CONFIGURATION
// ============================================

const CONFIG = {
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 6,
    MAX_USERNAME_LENGTH: 50,
    MAX_PASSWORD_LENGTH: 128,
    LOGIN_DELAY: 1500, // Simulated API call delay in ms
};

const VALIDATION_PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_.-]+$/,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

const ERROR_MESSAGES = {
    username: {
        required: 'Username or email is required',
        tooShort: `Username must be at least ${CONFIG.MIN_USERNAME_LENGTH} characters`,
        tooLong: `Username must not exceed ${CONFIG.MAX_USERNAME_LENGTH} characters`,
        invalid: 'Please enter a valid username or email address',
    },
    password: {
        required: 'Password is required',
        tooShort: `Password must be at least ${CONFIG.MIN_PASSWORD_LENGTH} characters`,
        tooLong: `Password must not exceed ${CONFIG.MAX_PASSWORD_LENGTH} characters`,
    },
    general: {
        invalidCredentials: 'Invalid username or password. Please try again.',
        networkError: 'Network error. Please check your connection and try again.',
        serverError: 'Server error. Please try again later.',
    },
};

// ============================================
// DOM ELEMENT REFERENCES
// ============================================

let elements = {};

function initializeElements() {
    elements = {
        loginForm: document.getElementById('loginForm'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        togglePasswordBtn: document.getElementById('togglePassword'),
        rememberMeCheckbox: document.getElementById('rememberMe'),
        loginButton: document.getElementById('loginButton'),
        buttonText: document.querySelector('.button-text'),
        buttonLoader: document.querySelector('.button-loader'),
        usernameError: document.getElementById('usernameError'),
        passwordError: document.getElementById('passwordError'),
        generalError: document.getElementById('generalError'),
        forgotPasswordLink: document.getElementById('forgotPasswordLink'),
        signupLink: document.getElementById('signupLink'),
    };
}



// ============================================
// VALIDATION FUNCTIONS
// ============================================

function isValidEmail(email) {
    return VALIDATION_PATTERNS.email.test(email);
}

function isValidUsername(username) {
    return VALIDATION_PATTERNS.username.test(username);
}

function validateUsername(username) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
        return { valid: false, message: ERROR_MESSAGES.username.required };
    }

    if (trimmedUsername.length < CONFIG.MIN_USERNAME_LENGTH) {
        return { valid: false, message: ERROR_MESSAGES.username.tooShort };
    }

    if (trimmedUsername.length > CONFIG.MAX_USERNAME_LENGTH) {
        return { valid: false, message: ERROR_MESSAGES.username.tooLong };
    }

    const isEmail = trimmedUsername.includes('@');
    if (isEmail && !isValidEmail(trimmedUsername)) {
        return { valid: false, message: ERROR_MESSAGES.username.invalid };
    }

    if (!isEmail && !isValidUsername(trimmedUsername)) {
        return { valid: false, message: ERROR_MESSAGES.username.invalid };
    }

    return { valid: true, message: '' };
}

function validatePassword(password) {
    if (!password) {
        return { valid: false, message: ERROR_MESSAGES.password.required };
    }

    if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
        return { valid: false, message: ERROR_MESSAGES.password.tooShort };
    }

    if (password.length > CONFIG.MAX_PASSWORD_LENGTH) {
        return { valid: false, message: ERROR_MESSAGES.password.tooLong };
    }

    return { valid: true, message: '' };
}

function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.add('show');
    }
}

function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        errorElement.classList.remove('show');
    }
}

function clearAllErrors() {
    clearError(elements.usernameError);
    clearError(elements.passwordError);
    clearError(elements.generalError);
}

function validateForm() {
    clearAllErrors();
    let isValid = true;

    const usernameValidation = validateUsername(elements.usernameInput.value);
    if (!usernameValidation.valid) {
        showError(elements.usernameError, usernameValidation.message);
        elements.usernameInput.classList.add('error');
        isValid = false;
    } else {
        elements.usernameInput.classList.remove('error');
    }

    const passwordValidation = validatePassword(elements.passwordInput.value);
    if (!passwordValidation.valid) {
        showError(elements.passwordError, passwordValidation.message);
        elements.passwordInput.classList.add('error');
        isValid = false;
    } else {
        elements.passwordInput.classList.remove('error');
    }

    return isValid;
}



// ============================================
// UI INTERACTION FUNCTIONS
// ============================================

function togglePasswordVisibility() {
    const passwordInput = elements.passwordInput;
    const toggleBtn = elements.togglePasswordBtn;
    const eyeIcon = toggleBtn.querySelector('.eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '🙈';
        toggleBtn.setAttribute('aria-label', 'Hide password');
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '👁️';
        toggleBtn.setAttribute('aria-label', 'Show password');
    }
}

function setLoadingState(isLoading) {
    if (isLoading) {
        elements.loginButton.disabled = true;
        elements.loginButton.classList.add('loading');
        elements.buttonText.style.display = 'none';
        elements.buttonLoader.style.display = 'inline-block';
        elements.usernameInput.disabled = true;
        elements.passwordInput.disabled = true;
    } else {
        elements.loginButton.disabled = false;
        elements.loginButton.classList.remove('loading');
        elements.buttonText.style.display = 'inline';
        elements.buttonLoader.style.display = 'none';
        elements.usernameInput.disabled = false;
        elements.passwordInput.disabled = false;
    }
}

function saveRememberMe() {
    if (elements.rememberMeCheckbox.checked) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedUsername', elements.usernameInput.value.trim());
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedUsername');
    }
}

function loadRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedUsername = localStorage.getItem('savedUsername');

    if (rememberMe === 'true' && savedUsername) {
        elements.usernameInput.value = savedUsername;
        elements.rememberMeCheckbox.checked = true;
    }
}

async function simulateLogin(username, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === 'demo@indianbank.com' && password === 'Demo@123') {
                resolve({ success: true, message: 'Login successful!' });
            } else if (username === 'admin' && password === 'Admin@123') {
                resolve({ success: true, message: 'Login successful!' });
            } else {
                resolve({ success: false, message: ERROR_MESSAGES.general.invalidCredentials });
            }
        }, CONFIG.LOGIN_DELAY);
    });
}

async function handleLogin(event) {
    event.preventDefault();
    clearAllErrors();

    if (!validateForm()) {
        return;
    }

    const username = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value;

    setLoadingState(true);

    try {
        const result = await simulateLogin(username, password);

        if (result.success) {
            saveRememberMe();
            showError(elements.generalError, result.message);
            elements.generalError.style.color = 'var(--success-color, #10b981)';
            
            setTimeout(() => {
                alert('Login successful! Redirecting to dashboard...');
                elements.loginForm.reset();
                clearAllErrors();
            }, 500);
        } else {
            showError(elements.generalError, result.message);
            elements.generalError.style.color = 'var(--error-color, #ef4444)';
        }
    } catch (error) {
        showError(elements.generalError, ERROR_MESSAGES.general.networkError);
        elements.generalError.style.color = 'var(--error-color, #ef4444)';
    } finally {
        setLoadingState(false);
    }
}



// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    elements.loginForm.addEventListener('submit', handleLogin);

    elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    elements.usernameInput.addEventListener('input', () => {
        if (elements.usernameError.textContent) {
            clearError(elements.usernameError);
            elements.usernameInput.classList.remove('error');
        }
    });

    elements.passwordInput.addEventListener('input', () => {
        if (elements.passwordError.textContent) {
            clearError(elements.passwordError);
            elements.passwordInput.classList.remove('error');
        }
    });

    elements.usernameInput.addEventListener('blur', () => {
        const validation = validateUsername(elements.usernameInput.value);
        if (!validation.valid && elements.usernameInput.value.trim()) {
            showError(elements.usernameError, validation.message);
            elements.usernameInput.classList.add('error');
        }
    });

    elements.passwordInput.addEventListener('blur', () => {
        const validation = validatePassword(elements.passwordInput.value);
        if (!validation.valid && elements.passwordInput.value) {
            showError(elements.passwordError, validation.message);
            elements.passwordInput.classList.add('error');
        }
    });

    elements.forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot Password functionality will be implemented soon.\n\nPlease contact your bank administrator for password reset.');
    });

    elements.signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Sign Up functionality will be implemented soon.\n\nPlease visit your nearest Indian Bank branch to open an account.');
    });

    elements.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initializeElements();
    attachEventListeners();
    loadRememberMe();

    console.log('Indian Bank Login Portal initialized successfully');
    console.log('Demo credentials:');
    console.log('  Email: demo@indianbank.com | Password: Demo@123');
    console.log('  Username: admin | Password: Admin@123');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateUsername,
        validatePassword,
        isValidEmail,
        isValidUsername,
        CONFIG,
        VALIDATION_PATTERNS,
    };
}

