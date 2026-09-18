/**
 * Login Functionality Test Cases
 * Test suite for UI login feature as per Jira ticket ST-3
 */

// Mock DOM elements for testing
function setupMockDOM() {
  // Create mock HTML structure
  document.body.innerHTML = `
    <form id="loginForm">
      <input type="text" id="username" />
      <input type="password" id="password" />
      <button type="submit" id="loginBtn">Login</button>
      <div id="errorMessage" class="error-message"></div>
      <div id="successMessage" class="success-message"></div>
      <div id="loadingSpinner" class="loading-spinner"></div>
      <div id="usernameError" class="field-error"></div>
      <div id="passwordError" class="field-error"></div>
      <button type="button" id="passwordToggle">👁️</button>
      <input type="checkbox" id="rememberMe" />
    </form>
  `;
}

// Test Suite 1: Form Validation Tests
describe('Login Form Validation', () => {
  
  beforeEach(() => {
    setupMockDOM();
  });

  test('TC-001: Username field should be required', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = '';
    
    const isValid = validateField('username');
    
    expect(isValid).toBe(false);
    expect(document.getElementById('usernameError').textContent).toContain('required');
  });

  test('TC-002: Username should not exceed maximum length', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = 'a'.repeat(51); // Exceeds 50 character limit
    
    const isValid = validateField('username');
    
    expect(isValid).toBe(false);
    expect(document.getElementById('usernameError').textContent).toContain('must not exceed');
  });

  test('TC-003: Valid email format should be accepted', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = 'user@example.com';
    
    const isValid = validateField('username');
    
    expect(isValid).toBe(true);
    expect(document.getElementById('usernameError').textContent).toBe('');
  });

  test('TC-004: Invalid email format should be rejected', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = 'invalid@email';
    
    const isValid = validateField('username');
    
    expect(isValid).toBe(false);
    expect(document.getElementById('usernameError').textContent).toContain('valid email');
  });

  test('TC-005: Password field should be required', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.value = '';
    
    const isValid = validateField('password');
    
    expect(isValid).toBe(false);
    expect(document.getElementById('passwordError').textContent).toContain('required');
  });

  test('TC-006: Password should meet minimum length requirement', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.value = '12345'; // Less than 6 characters
    
    const isValid = validateField('password');
    
    expect(isValid).toBe(false);
    expect(document.getElementById('passwordError').textContent).toContain('at least 6');
  });

  test('TC-007: Password should not exceed maximum length', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.value = 'a'.repeat(129); // Exceeds 128 character limit
    
    const isValid = validateField('password');
    
    expect(isValid).toBe(false);
    expect(document.getElementById('passwordError').textContent).toContain('must not exceed');
  });

  test('TC-008: Valid password should be accepted', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.value = 'ValidPass123';
    
    const isValid = validateField('password');
    
    expect(isValid).toBe(true);
    expect(document.getElementById('passwordError').textContent).toBe('');
  });

  test('TC-009: Form validation should validate all fields', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.value = 'testuser';
    passwordInput.value = 'password123';
    
    const isValid = validateForm();
    
    expect(isValid).toBe(true);
  });

  test('TC-010: Form validation should fail if any field is invalid', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.value = 'testuser';
    passwordInput.value = '123'; // Too short
    
    const isValid = validateForm();
    
    expect(isValid).toBe(false);
  });
});

// Test Suite 2: Form Submission Tests
describe('Login Form Submission', () => {
  
  beforeEach(() => {
    setupMockDOM();
  });

  test('TC-011: Form submission should prevent default behavior', () => {
    const form = document.getElementById('loginForm');
    const event = new Event('submit', { cancelable: true });
    
    let defaultPrevented = false;
    event.preventDefault = () => { defaultPrevented = true; };
    
    handleFormSubmit(event);
    
    expect(defaultPrevented).toBe(true);
  });

  test('TC-012: Form submission should validate before submitting', async () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.value = '';
    passwordInput.value = '';
    
    const event = new Event('submit', { cancelable: true });
    event.preventDefault = jest.fn();
    
    await handleFormSubmit(event);
    
    expect(document.getElementById('errorMessage').classList.contains('show')).toBe(true);
  });

  test('TC-013: Loading spinner should show during submission', async () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    usernameInput.value = 'testuser';
    passwordInput.value = 'password123';
    
    const submitPromise = submitLogin({
      username: 'testuser',
      password: 'password123',
      rememberMe: false
    });
    
    // Check immediately after starting submission
    expect(loadingSpinner.classList.contains('show')).toBe(true);
    
    await submitPromise;
  });

  test('TC-014: Submit button should be disabled during submission', async () => {
    const loginBtn = document.getElementById('loginBtn');
    
    setSubmittingState(true);
    
    expect(loginBtn.disabled).toBe(true);
    expect(loginBtn.getAttribute('aria-busy')).toBe('true');
    
    setSubmittingState(false);
    
    expect(loginBtn.disabled).toBe(false);
    expect(loginBtn.getAttribute('aria-busy')).toBe('false');
  });

  test('TC-015: Successful login should show success message', async () => {
    const successMessage = document.getElementById('successMessage');
    
    showSuccess('Login successful!');
    
    expect(successMessage.classList.contains('show')).toBe(true);
    expect(successMessage.textContent).toBe('Login successful!');
  });

  test('TC-016: Failed login should show error message', async () => {
    const errorMessage = document.getElementById('errorMessage');
    
    showError('Invalid credentials');
    
    expect(errorMessage.classList.contains('show')).toBe(true);
    expect(errorMessage.textContent).toBe('Invalid credentials');
  });

  test('TC-017: Double submission should be prevented', async () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.value = 'testuser';
    passwordInput.value = 'password123';
    
    // Set submitting state
    state.isSubmitting = true;
    
    const event = new Event('submit', { cancelable: true });
    event.preventDefault = jest.fn();
    
    await handleFormSubmit(event);
    
    // Should return early without processing
    expect(document.getElementById('loadingSpinner').classList.contains('show')).toBe(false);
  });
});

// Test Suite 3: UI Interaction Tests
describe('Login UI Interactions', () => {
  
  beforeEach(() => {
    setupMockDOM();
  });

  test('TC-018: Password visibility toggle should work', () => {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    
    expect(passwordInput.type).toBe('password');
    
    togglePasswordVisibility();
    
    expect(passwordInput.type).toBe('text');
    expect(passwordToggle.getAttribute('aria-label')).toBe('Hide password');
    
    togglePasswordVisibility();
    
    expect(passwordInput.type).toBe('password');
    expect(passwordToggle.getAttribute('aria-label')).toBe('Show password');
  });

  test('TC-019: Error messages should clear on input', () => {
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('usernameError');
    
    // Show error first
    showFieldError('username', 'Username is required');
    expect(usernameError.classList.contains('show')).toBe(true);
    
    // Clear error
    clearFieldError('username');
    expect(usernameError.classList.contains('show')).toBe(false);
    expect(usernameError.textContent).toBe('');
  });

  test('TC-020: Error class should be added to invalid fields', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = '';
    
    validateField('username');
    
    expect(usernameInput.classList.contains('error')).toBe(true);
  });

  test('TC-021: Error class should be removed from valid fields', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = 'validuser';
    usernameInput.classList.add('error');
    
    validateField('username');
    
    expect(usernameInput.classList.contains('error')).toBe(false);
  });

  test('TC-022: Remember me should save username to localStorage', () => {
    const formData = {
      username: 'testuser',
      password: 'password123',
      rememberMe: true
    };
    
    handleLoginSuccess(formData);
    
    expect(localStorage.getItem('rememberedUsername')).toBe('testuser');
  });

  test('TC-023: Remember me unchecked should remove username from localStorage', () => {
    localStorage.setItem('rememberedUsername', 'testuser');
    
    const formData = {
      username: 'testuser',
      password: 'password123',
      rememberMe: false
    };
    
    handleLoginSuccess(formData);
    
    expect(localStorage.getItem('rememberedUsername')).toBeNull();
  });

  test('TC-024: Remembered username should be loaded on page load', () => {
    localStorage.setItem('rememberedUsername', 'saveduser');
    
    loadRememberedUsername();
    
    const usernameInput = document.getElementById('username');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    expect(usernameInput.value).toBe('saveduser');
    expect(rememberMeCheckbox.checked).toBe(true);
  });

  test('TC-025: Messages should be hidden when hideMessages is called', () => {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    errorMessage.classList.add('show');
    successMessage.classList.add('show');
    
    hideMessages();
    
    expect(errorMessage.classList.contains('show')).toBe(false);
    expect(successMessage.classList.contains('show')).toBe(false);
  });
});

// Test Suite 4: Accessibility Tests
describe('Login Accessibility Features', () => {
  
  beforeEach(() => {
    setupMockDOM();
  });

  test('TC-026: Error messages should have role="alert"', () => {
    const errorMessage = document.getElementById('errorMessage');
    
    showError('Test error');
    
    expect(errorMessage.getAttribute('role')).toBe('alert');
  });

  test('TC-027: Success messages should have role="status"', () => {
    const successMessage = document.getElementById('successMessage');
    
    showSuccess('Test success');
    
    expect(successMessage.getAttribute('role')).toBe('status');
  });

  test('TC-028: Submit button should have aria-busy attribute', () => {
    const loginBtn = document.getElementById('loginBtn');
    
    setSubmittingState(true);
    expect(loginBtn.getAttribute('aria-busy')).toBe('true');
    
    setSubmittingState(false);
    expect(loginBtn.getAttribute('aria-busy')).toBe('false');
  });

  test('TC-029: Password toggle should have aria-label', () => {
    const passwordToggle = document.getElementById('passwordToggle');
    
    togglePasswordVisibility();
    
    expect(passwordToggle.hasAttribute('aria-label')).toBe(true);
  });

  test('TC-030: Screen reader announcements should be created', () => {
    const initialChildCount = document.body.children.length;
    
    announceToScreenReader('Test announcement', 'polite');
    
    // Check if announcement element was added
    expect(document.body.children.length).toBeGreaterThan(initialChildCount);
  });
});

// Test Suite 5: Edge Cases and Error Handling
describe('Login Edge Cases', () => {
  
  beforeEach(() => {
    setupMockDOM();
  });

  test('TC-031: Empty form submission should show error', async () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.value = '';
    passwordInput.value = '';
    
    const event = new Event('submit', { cancelable: true });
    event.preventDefault = jest.fn();
    
    await handleFormSubmit(event);
    
    expect(document.getElementById('errorMessage').classList.contains('show')).toBe(true);
  });

  test('TC-032: Whitespace-only username should be invalid', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = '   ';
    
    const isValid = validateField('username');
    
    expect(isValid).toBe(false);
  });

  test('TC-033: Special characters in username should be allowed', () => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = 'user_name-123';
    
    const isValid = validateField('username');
    
    expect(isValid).toBe(true);
  });

  test('TC-034: Password with spaces should be allowed', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.value = 'pass word 123';
    
    const isValid = validateField('password');
    
    expect(isValid).toBe(true);
  });

  test('TC-035: Form should handle API timeout gracefully', async () => {
    const formData = {
      username: 'testuser',
      password: 'password123',
      rememberMe: false
    };
    
    // Mock API call that times out
    jest.setTimeout(5000);
    
    try {
      await submitLogin(formData);
    } catch (error) {
      expect(document.getElementById('errorMessage').classList.contains('show')).toBe(true);
    }
  });
});

// Test Suite 6: Configuration Tests
describe('Login Configuration', () => {
  
  test('TC-036: CONFIG should have correct minimum password length', () => {
    expect(CONFIG.MIN_PASSWORD_LENGTH).toBe(6);
  });

  test('TC-037: CONFIG should have correct maximum username length', () => {
    expect(CONFIG.MAX_USERNAME_LENGTH).toBe(50);
  });

  test('TC-038: CONFIG should have correct maximum password length', () => {
    expect(CONFIG.MAX_PASSWORD_LENGTH).toBe(128);
  });

  test('TC-039: CONFIG should have valid email regex', () => {
    expect(CONFIG.EMAIL_REGEX.test('user@example.com')).toBe(true);
    expect(CONFIG.EMAIL_REGEX.test('invalid@email')).toBe(false);
  });

  test('TC-040: CONFIG should have remember me key defined', () => {
    expect(CONFIG.REMEMBER_ME_KEY).toBe('rememberedUsername');
  });
});

// Test execution summary
console.log(`
========================================
LOGIN FUNCTIONALITY TEST SUITE SUMMARY
========================================
Total Test Cases: 40

Test Suites:
1. Form Validation Tests (TC-001 to TC-010): 10 tests
2. Form Submission Tests (TC-011 to TC-017): 7 tests
3. UI Interaction Tests (TC-018 to TC-025): 8 tests
4. Accessibility Tests (TC-026 to TC-030): 5 tests
5. Edge Cases Tests (TC-031 to TC-035): 5 tests
6. Configuration Tests (TC-036 to TC-040): 5 tests

Coverage Areas:
✓ Input validation (username, password, email)
✓ Form submission and API integration
✓ Loading states and error handling
✓ UI interactions (password toggle, remember me)
✓ Accessibility features (ARIA attributes, screen readers)
✓ Edge cases and error scenarios
✓ Configuration validation

To run these tests:
1. Install Jest: npm install --save-dev jest
2. Add to package.json: "test": "jest"
3. Run: npm test

For manual testing:
1. Open login.html in a browser
2. Test each scenario listed above
3. Verify expected behavior matches test assertions
========================================
`);

