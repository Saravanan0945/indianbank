# Test Data Usage Guide

## 📖 Quick Reference for Using login-test-data.js

This guide provides quick examples of how to use the test data fixtures in your test cases.

---

## 🚀 Importing Test Data

### Import All Test Data
```javascript
import testData from './login-test-data.js';
```

### Import Specific Data Sets
```javascript
import {
  VALID_USERS,
  INVALID_CREDENTIALS,
  MALFORMED_INPUTS,
  MOCK_SUCCESS_RESPONSE,
  MOCK_ERROR_RESPONSES,
  VALIDATION_ERROR_MESSAGES
} from './login-test-data.js';
```

---

## 📝 Usage Examples

### 1. Using Valid User Credentials

```javascript
import { VALID_USERS } from './login-test-data.js';

test('should login successfully with valid credentials', async () => {
  const user = VALID_USERS[0]; // Get first valid user
  
  // Use in test
  await fillLoginForm(user.username, user.password);
  await submitForm();
  
  expect(getSuccessMessage()).toBe('Login successful');
});
```

### 2. Using Invalid Credentials

```javascript
import { INVALID_CREDENTIALS } from './login-test-data.js';

test('should show error for invalid credentials', async () => {
  const invalidCred = INVALID_CREDENTIALS[0];
  
  await fillLoginForm(invalidCred.username, invalidCred.password);
  await submitForm();
  
  expect(getErrorMessage()).toBe(invalidCred.expectedError);
});
```

### 3. Using Malformed Inputs

```javascript
import { MALFORMED_INPUTS } from './login-test-data.js';

test('should validate empty username', () => {
  const emptyUsername = MALFORMED_INPUTS.find(
    input => input.description === 'Empty username field'
  );
  
  const result = validateEmail(emptyUsername.username);
  
  expect(result.isValid).toBe(false);
  expect(result.error).toBe(emptyUsername.expectedError);
});
```

### 4. Using Mock API Responses

```javascript
import { MOCK_SUCCESS_RESPONSE, MOCK_ERROR_RESPONSES } from './login-test-data.js';

test('should handle successful API response', async () => {
  // Mock fetch to return success response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(MOCK_SUCCESS_RESPONSE)
    })
  );
  
  const response = await submitLogin('user@test.com', 'password');
  
  expect(response.success).toBe(true);
  expect(response.data.token).toBeDefined();
});

test('should handle invalid credentials error', async () => {
  // Mock fetch to return error response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve(MOCK_ERROR_RESPONSES.INVALID_CREDENTIALS)
    })
  );
  
  await expect(submitLogin('wrong@test.com', 'wrong')).rejects.toThrow();
});
```

### 5. Using Validation Error Messages

```javascript
import { VALIDATION_ERROR_MESSAGES } from './login-test-data.js';

test('should show correct error for empty password', () => {
  const error = validatePassword('');
  
  expect(error).toBe(VALIDATION_ERROR_MESSAGES.PASSWORD_REQUIRED);
});
```

### 6. Using Boundary Values

```javascript
import { BOUNDARY_VALUES } from './login-test-data.js';

test('should accept minimum valid password length', () => {
  const result = validatePassword(BOUNDARY_VALUES.PASSWORD.VALID_MIN);
  
  expect(result.isValid).toBe(true);
});

test('should reject password below minimum length', () => {
  const result = validatePassword(BOUNDARY_VALUES.PASSWORD.INVALID_TOO_SHORT);
  
  expect(result.isValid).toBe(false);
  expect(result.error).toBe(VALIDATION_ERROR_MESSAGES.PASSWORD_TOO_SHORT);
});
```

### 7. Using Helper Functions

```javascript
import {
  getRandomValidUser,
  getRandomInvalidCredential,
  createMockResponse,
  getMockErrorResponse
} from './login-test-data.js';

test('should handle random valid user', async () => {
  const user = getRandomValidUser();
  
  await fillLoginForm(user.username, user.password);
  // ... rest of test
});

test('should handle random invalid credential', async () => {
  const invalidCred = getRandomInvalidCredential();
  
  await fillLoginForm(invalidCred.username, invalidCred.password);
  // ... rest of test
});

test('should handle custom mock response', () => {
  const customResponse = createMockResponse(
    true,
    'Custom success message',
    { userId: '123' },
    200
  );
  
  expect(customResponse.success).toBe(true);
  expect(customResponse.data.userId).toBe('123');
});

test('should handle specific error type', () => {
  const errorResponse = getMockErrorResponse('ACCOUNT_LOCKED');
  
  expect(errorResponse.statusCode).toBe(403);
  expect(errorResponse.error.type).toBe('ACCOUNT_LOCKED');
});
```

### 8. Using Special Character Inputs

```javascript
import { SPECIAL_CHARACTER_INPUTS } from './login-test-data.js';

test('should sanitize SQL injection attempt', () => {
  const sqlInjection = SPECIAL_CHARACTER_INPUTS.find(
    input => input.description.includes('SQL injection')
  );
  
  const sanitized = sanitizeInput(sqlInjection.username);
  
  expect(sanitized).not.toContain("'");
  expect(sanitized).not.toContain('OR');
});

test('should sanitize XSS attempt', () => {
  const xssAttempt = SPECIAL_CHARACTER_INPUTS.find(
    input => input.description.includes('XSS attempt')
  );
  
  const sanitized = sanitizeInput(xssAttempt.username);
  
  expect(sanitized).not.toContain('<script>');
  expect(sanitized).not.toContain('</script>');
});
```

### 9. Using DOM Element IDs

```javascript
import { DOM_ELEMENTS } from './login-test-data.js';

test('should find all required DOM elements', () => {
  const form = document.getElementById(DOM_ELEMENTS.FORM);
  const username = document.getElementById(DOM_ELEMENTS.USERNAME_INPUT);
  const password = document.getElementById(DOM_ELEMENTS.PASSWORD_INPUT);
  const loginBtn = document.getElementById(DOM_ELEMENTS.LOGIN_BUTTON);
  
  expect(form).toBeTruthy();
  expect(username).toBeTruthy();
  expect(password).toBeTruthy();
  expect(loginBtn).toBeTruthy();
});
```

### 10. Using Storage Keys

```javascript
import { STORAGE_KEYS } from './login-test-data.js';

test('should store auth token in localStorage', () => {
  const token = 'test-token-123';
  
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  
  expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(token);
});

test('should clear all session data', () => {
  // Set some data
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'token');
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({ id: '123' }));
  
  // Clear session
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Verify cleared
  expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
  expect(localStorage.getItem(STORAGE_KEYS.USER_DATA)).toBeNull();
});
```

### 11. Using Rate Limit Configuration

```javascript
import { RATE_LIMIT_CONFIG } from './login-test-data.js';

test('should enforce rate limiting', () => {
  // Simulate multiple login attempts
  for (let i = 0; i < RATE_LIMIT_CONFIG.MAX_ATTEMPTS; i++) {
    attemptLogin('user@test.com', 'wrong-password');
  }
  
  // Next attempt should be blocked
  const result = attemptLogin('user@test.com', 'wrong-password');
  
  expect(result.blocked).toBe(true);
  expect(result.retryAfter).toBe(RATE_LIMIT_CONFIG.LOCKOUT_DURATION);
});
```

### 12. Using Timeout Values

```javascript
import { TIMEOUT_VALUES } from './login-test-data.js';

test('should timeout after configured duration', async () => {
  jest.setTimeout(TIMEOUT_VALUES.API_TIMEOUT + 1000);
  
  // Mock slow API
  global.fetch = jest.fn(() => 
    new Promise(resolve => 
      setTimeout(resolve, TIMEOUT_VALUES.API_TIMEOUT + 500)
    )
  );
  
  await expect(submitLogin('user@test.com', 'password'))
    .rejects
    .toThrow('Request timeout');
}, TIMEOUT_VALUES.API_TIMEOUT + 2000);
```

---

## 🎯 Best Practices

### 1. Use Descriptive Test Names
```javascript
// ✅ Good
test('should display "Username is required" error when username is empty', () => {
  // ...
});

// ❌ Bad
test('test1', () => {
  // ...
});
```

### 2. Use Test Data Constants
```javascript
// ✅ Good
import { VALIDATION_ERROR_MESSAGES } from './login-test-data.js';
expect(error).toBe(VALIDATION_ERROR_MESSAGES.USERNAME_REQUIRED);

// ❌ Bad
expect(error).toBe('Username is required'); // Hardcoded string
```

### 3. Reuse Test Data
```javascript
// ✅ Good
import { VALID_USERS } from './login-test-data.js';
VALID_USERS.forEach(user => {
  test(`should login successfully with ${user.description}`, async () => {
    // Test with each valid user
  });
});

// ❌ Bad
test('should login with user 1', () => { /* ... */ });
test('should login with user 2', () => { /* ... */ });
test('should login with user 3', () => { /* ... */ });
```

### 4. Use Helper Functions
```javascript
// ✅ Good
import { getRandomValidUser } from './login-test-data.js';
const user = getRandomValidUser();

// ❌ Bad
const user = {
  username: 'test@test.com',
  password: 'password123'
}; // Manually creating test data
```

### 5. Mock API Responses Consistently
```javascript
// ✅ Good
import { MOCK_SUCCESS_RESPONSE } from './login-test-data.js';
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(MOCK_SUCCESS_RESPONSE)
  })
);

// ❌ Bad
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: {} })
  })
); // Inconsistent response structure
```

---

## 📊 Test Data Summary

### Available Data Sets

| Data Set | Count | Purpose |
|----------|-------|---------|
| VALID_USERS | 5 | Valid login credentials |
| INVALID_CREDENTIALS | 5 | Invalid login scenarios |
| MALFORMED_INPUTS | 11 | Validation testing |
| SPECIAL_CHARACTER_INPUTS | 8 | Security testing |
| MOCK_ERROR_RESPONSES | 8 | Error handling |
| VALIDATION_ERROR_MESSAGES | 13 | Error message validation |
| SUCCESS_MESSAGES | 2 | Success message validation |

### Helper Functions

| Function | Purpose |
|----------|---------|
| `getRandomValidUser()` | Get random valid user |
| `getRandomInvalidCredential()` | Get random invalid credential |
| `getRandomMalformedInput()` | Get random malformed input |
| `createMockResponse()` | Create custom mock response |
| `getMockErrorResponse()` | Get specific error response |

---

## 🔍 Finding Specific Test Data

### By Description
```javascript
const testCase = MALFORMED_INPUTS.find(
  input => input.description === 'Empty username field'
);
```

### By Expected Error
```javascript
const testCase = INVALID_CREDENTIALS.find(
  cred => cred.expectedError === 'Account is locked. Please contact support.'
);
```

### By Username Pattern
```javascript
const emailUsers = VALID_USERS.filter(
  user => user.username.includes('@')
);
```

---

## 📚 Additional Resources

- **Main Test Suite**: `login.test.js`
- **Test Documentation**: `README.md`
- **Implementation**: `src/main/webapp/js/login.js`
- **HTML Page**: `src/main/webapp/login.html`

---

## 💡 Tips

1. **Always import test data** instead of hardcoding values
2. **Use helper functions** for random test data generation
3. **Keep test data centralized** in `login-test-data.js`
4. **Update test data** when requirements change
5. **Document new test data** with JSDoc comments

---

## ✅ Checklist for Using Test Data

- [ ] Import required test data at the top of test file
- [ ] Use constants instead of hardcoded strings
- [ ] Leverage helper functions for random data
- [ ] Mock API responses using provided fixtures
- [ ] Validate error messages against constants
- [ ] Use DOM element IDs from constants
- [ ] Use storage keys from constants
- [ ] Follow boundary values for validation tests

---

**Happy Testing! 🎉**

