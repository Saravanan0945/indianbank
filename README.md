# Indian Bank - UI Login Feature

## Overview
This project implements a secure, accessible, and user-friendly login page for Indian Bank with comprehensive JavaScript functionality and test coverage.

## 📁 Project Structure

```
indianbank/
├── src/main/webapp/
│   ├── login.html              # Login page HTML
│   ├── css/
│   │   └── login.css          # Login page styles
│   └── js/
│       ├── login.js           # Login functionality (425 lines)
│       └── login.test.js      # Test suite (71 test cases)
├── package.json               # NPM configuration
└── README.md                  # This file
```

## ✨ Features

### Core Functionality
- ✅ **Form Validation**
  - Real-time email/username validation
  - Password strength validation
  - Field-level error messages
  - Form-level validation before submission

- ✅ **Authentication**
  - Secure API integration
  - Token-based authentication
  - Session management (localStorage/sessionStorage)
  - Remember me functionality

- ✅ **Security**
  - Rate limiting (5 attempts per 15 minutes)
  - XSS prevention with input sanitization
  - Password masking with toggle visibility
  - Secure token storage
  - Prevention of multiple simultaneous submissions

- ✅ **User Experience**
  - Loading indicators during API calls
  - Clear error and success messages
  - Responsive design
  - Keyboard navigation support
  - Password visibility toggle

- ✅ **Accessibility**
  - ARIA attributes for screen readers
  - Keyboard navigation
  - Focus management
  - Semantic HTML
  - WCAG 2.1 compliant

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Configuration

### API Endpoints
Update the API endpoints in `src/main/webapp/js/login.js`:

```javascript
const CONFIG = {
    API_ENDPOINTS: {
        LOGIN: '/api/auth/login',      // Update with your login endpoint
        LOGOUT: '/api/auth/logout',    // Update with your logout endpoint
        REFRESH: '/api/auth/refresh'   // Update with your refresh endpoint
    },
    REDIRECT_URLS: {
        SUCCESS: '/dashboard.html',    // Update redirect after login
        LOGOUT: '/login.html'          // Update redirect after logout
    }
};
```

### Validation Rules
Customize validation rules in the CONFIG object:

```javascript
const CONFIG = {
    MIN_PASSWORD_LENGTH: 6,           // Minimum password length
    MAX_PASSWORD_LENGTH: 128,         // Maximum password length
    MAX_USERNAME_LENGTH: 50,          // Maximum username length
    MAX_LOGIN_ATTEMPTS: 5,            // Max attempts before rate limit
    RATE_LIMIT_WINDOW: 15 * 60 * 1000 // Rate limit window (15 minutes)
};
```

## 🧪 Testing

### Test Coverage
The project includes **71 comprehensive test cases** covering:

1. **Validation Tests (15 tests)**
   - Email validation (empty, null, valid, invalid, length)
   - Password validation (empty, length, special characters)
   - Form validation (complete form, partial errors)

2. **UI Feedback Tests (10 tests)**
   - Error message display
   - Success message display
   - Loading state management
   - Field-level error display

3. **Rate Limiting Tests (6 tests)**
   - Rate limit checking
   - Attempt counting
   - Time window reset
   - Formatting remaining time

4. **Session Management Tests (9 tests)**
   - Token storage (localStorage/sessionStorage)
   - User data storage
   - Session clearing
   - Login state detection

5. **Login Flow Tests (15 tests)**
   - API call handling
   - Success response processing
   - Error handling (401, 403, 500, network errors)
   - Password clearing
   - Redirect after success

6. **Event Handler Tests (11 tests)**
   - Password toggle
   - Form submission
   - Multiple submission prevention
   - Input field events

7. **Security Tests (3 tests)**
   - XSS prevention
   - Input sanitization
   - Safe text preservation

8. **Integration Tests (2 tests)**
   - Complete successful login flow
   - Complete failed login flow

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

### Test Results
Expected output:
```
Test Suites: 1 passed, 1 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        X.XXXs
```

## 📖 API Integration

### Expected API Request Format

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

### Expected API Response Format

**Success Response (200 OK):**
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-string",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

**Error Response (401 Unauthorized):**
```javascript
{
  "message": "Invalid username or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Error Response (403 Forbidden):**
```javascript
{
  "message": "Account is locked",
  "code": "ACCOUNT_LOCKED"
}
```

## 🔧 Usage

### Basic Usage
1. Open `login.html` in a web browser
2. Enter username/email and password
3. Click "Login" or press Enter
4. System will validate inputs and submit to API
5. On success, redirects to dashboard
6. On failure, displays appropriate error message

### JavaScript Functions

#### Validation Functions
```javascript
validateEmail(email)        // Validates email format
validatePassword(password)  // Validates password requirements
validateForm()             // Validates entire form
```

#### UI Functions
```javascript
showError(message)         // Display error message
showSuccess(message)       // Display success message
showLoading()             // Show loading spinner
hideLoading()             // Hide loading spinner
```

#### Core Functions
```javascript
handleLogin(event)                    // Main login handler
submitLogin(username, password)       // API call
handleLoginSuccess(response, remember) // Success handler
handleLoginError(error)               // Error handler
```

## 🔒 Security Features

1. **Rate Limiting**
   - Maximum 5 login attempts per 15 minutes
   - Automatic reset after time window
   - Persistent across page reloads

2. **Input Sanitization**
   - XSS prevention
   - HTML entity encoding
   - Safe text handling

3. **Password Security**
   - Password masking by default
   - Optional visibility toggle
   - Cleared after failed attempts
   - Not stored in any logs

4. **Token Management**
   - Secure storage (localStorage/sessionStorage)
   - Automatic cleanup on logout
   - Refresh token support

## 🎨 Customization

### Styling
Modify `src/main/webapp/css/login.css` to customize:
- Colors and branding
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

### Validation Rules
Update CONFIG object in `login.js`:
```javascript
const CONFIG = {
    MIN_PASSWORD_LENGTH: 8,  // Change minimum password length
    EMAIL_REGEX: /custom-regex/,  // Custom email validation
    // ... other settings
};
```

### Error Messages
Customize error messages in `handleLoginError()` function:
```javascript
function handleLoginError(error) {
    let errorMessage = 'Custom error message';
    // ... customize messages
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue: Tests failing**
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue: API calls not working**
- Check API endpoint configuration in CONFIG object
- Verify CORS settings on backend
- Check network tab in browser DevTools

**Issue: Rate limiting not working**
- Check localStorage is enabled in browser
- Verify time synchronization
- Clear localStorage: `localStorage.clear()`

## 📊 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📄 License

Copyright © 2024 Indian Bank. All rights reserved.

## 👥 Support

For issues or questions:
- Create an issue in the project repository
- Contact the development team
- Refer to the API documentation

## 🔄 Version History

### Version 1.0.0 (Current)
- Initial release
- Complete login functionality
- 71 test cases
- Full documentation
- Accessibility compliance

---

**Last Updated:** 2024
**Jira Ticket:** ST-3
**Status:** ✅ Complete

