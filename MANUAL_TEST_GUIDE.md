# Manual Test Execution Guide
## UI Login Feature Test Cases

### Test Environment Setup
1. Open `src/main/webapp/login.html` in a web browser
2. Open browser Developer Tools (F12)
3. Clear browser cache and localStorage
4. Ensure JavaScript is enabled

---

## Test Suite 1: Form Validation Tests

### TC-001: Username Required Validation
**Steps:**
1. Leave username field empty
2. Enter password: "test123"
3. Click outside username field (blur event)

**Expected Result:**
- Red error message appears below username field
- Message: "Username or email is required."
- Username field has red border

**Status:** [ ] Pass [ ] Fail

---

### TC-002: Username Maximum Length
**Steps:**
1. Enter 51 characters in username field
2. Click outside username field

**Expected Result:**
- Error message: "Username must not exceed 50 characters."
- Field shows error state

**Status:** [ ] Pass [ ] Fail

---

### TC-003: Valid Email Format
**Steps:**
1. Enter: "user@example.com"
2. Click outside username field

**Expected Result:**
- No error message
- Field shows normal state
- Green checkmark or no error indicator

**Status:** [ ] Pass [ ] Fail

---

### TC-004: Invalid Email Format
**Steps:**
1. Enter: "invalid@email"
2. Click outside username field

**Expected Result:**
- Error message: "Please enter a valid email address."
- Field shows error state

**Status:** [ ] Pass [ ] Fail

---

### TC-005: Password Required Validation
**Steps:**
1. Enter username: "testuser"
2. Leave password field empty
3. Click outside password field

**Expected Result:**
- Error message: "Password is required."
- Password field has red border

**Status:** [ ] Pass [ ] Fail

---

### TC-006: Password Minimum Length
**Steps:**
1. Enter password: "12345" (5 characters)
2. Click outside password field

**Expected Result:**
- Error message: "Password must be at least 6 characters."
- Field shows error state

**Status:** [ ] Pass [ ] Fail

---

### TC-007: Password Maximum Length
**Steps:**
1. Enter 129 characters in password field
2. Click outside password field

**Expected Result:**
- Error message: "Password must not exceed 128 characters."
- Field shows error state

**Status:** [ ] Pass [ ] Fail

---

### TC-008: Valid Password
**Steps:**
1. Enter password: "ValidPass123"
2. Click outside password field

**Expected Result:**
- No error message
- Field shows normal state

**Status:** [ ] Pass [ ] Fail

---

### TC-009: Complete Form Validation - Valid
**Steps:**
1. Enter username: "testuser"
2. Enter password: "password123"
3. Click Login button

**Expected Result:**
- No validation errors
- Form submits successfully
- Loading spinner appears

**Status:** [ ] Pass [ ] Fail

---

### TC-010: Complete Form Validation - Invalid
**Steps:**
1. Enter username: "testuser"
2. Enter password: "123" (too short)
3. Click Login button

**Expected Result:**
- Error message at top: "Please correct the errors before submitting."
- Password field shows error
- Form does not submit

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 2: Form Submission Tests

### TC-011: Form Submission Prevention
**Steps:**
1. Enter valid credentials
2. Click Login button
3. Check browser console

**Expected Result:**
- Page does not reload
- No full page refresh
- AJAX submission occurs

**Status:** [ ] Pass [ ] Fail

---

### TC-012: Validation Before Submission
**Steps:**
1. Leave all fields empty
2. Click Login button

**Expected Result:**
- Error message appears
- Form does not submit
- No API call made

**Status:** [ ] Pass [ ] Fail

---

### TC-013: Loading Spinner Display
**Steps:**
1. Enter valid credentials
2. Click Login button
3. Observe button

**Expected Result:**
- Spinner appears inside button
- Button text may change or spinner shows alongside text
- Spinner animates (rotating)

**Status:** [ ] Pass [ ] Fail

---

### TC-014: Button Disabled During Submission
**Steps:**
1. Enter valid credentials
2. Click Login button
3. Try clicking button again immediately

**Expected Result:**
- Button becomes disabled
- Button has "aria-busy=true" attribute
- Second click has no effect

**Status:** [ ] Pass [ ] Fail

---

### TC-015: Success Message Display
**Steps:**
1. Enter valid credentials (any username, password 6+ chars)
2. Click Login button
3. Wait for response

**Expected Result:**
- Green success message appears
- Message: "Login successful! Redirecting..."
- Form fields are cleared

**Status:** [ ] Pass [ ] Fail

---

### TC-016: Error Message Display
**Steps:**
1. Modify mockLoginAPI to return error
2. Enter credentials
3. Click Login button

**Expected Result:**
- Red error message appears
- Message shows error details
- Form remains filled

**Status:** [ ] Pass [ ] Fail

---

### TC-017: Double Submission Prevention
**Steps:**
1. Enter valid credentials
2. Click Login button twice quickly

**Expected Result:**
- Only one API call is made
- Second click is ignored
- No duplicate submissions

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 3: UI Interaction Tests

### TC-018: Password Visibility Toggle
**Steps:**
1. Enter password: "test123"
2. Click eye icon button
3. Click eye icon again

**Expected Result:**
- First click: Password becomes visible (text)
- Icon changes to "eye with slash"
- Second click: Password hidden again
- Icon changes back to "eye"

**Status:** [ ] Pass [ ] Fail

---

### TC-019: Error Clearing on Input
**Steps:**
1. Leave username empty and blur (show error)
2. Start typing in username field

**Expected Result:**
- Error message disappears immediately
- Red border is removed
- Field returns to normal state

**Status:** [ ] Pass [ ] Fail

---

### TC-020: Error Class on Invalid Field
**Steps:**
1. Enter invalid data in username
2. Blur the field

**Expected Result:**
- Field has "error" CSS class
- Red border appears
- Error styling is applied

**Status:** [ ] Pass [ ] Fail

---

### TC-021: Error Class Removal on Valid Input
**Steps:**
1. Show error on username field
2. Enter valid username
3. Blur the field

**Expected Result:**
- "error" class is removed
- Red border disappears
- Field returns to normal styling

**Status:** [ ] Pass [ ] Fail

---

### TC-022: Remember Me - Save Username
**Steps:**
1. Enter username: "testuser"
2. Enter password: "password123"
3. Check "Remember me" checkbox
4. Click Login button
5. Check localStorage in DevTools

**Expected Result:**
- localStorage contains key "rememberedUsername"
- Value is "testuser"

**Status:** [ ] Pass [ ] Fail

---

### TC-023: Remember Me - Remove Username
**Steps:**
1. Set localStorage with remembered username
2. Enter credentials
3. Uncheck "Remember me"
4. Click Login button
5. Check localStorage

**Expected Result:**
- "rememberedUsername" key is removed from localStorage
- No username is saved

**Status:** [ ] Pass [ ] Fail

---

### TC-024: Load Remembered Username
**Steps:**
1. Set localStorage: `localStorage.setItem('rememberedUsername', 'saveduser')`
2. Refresh the page

**Expected Result:**
- Username field is pre-filled with "saveduser"
- "Remember me" checkbox is checked

**Status:** [ ] Pass [ ] Fail

---

### TC-025: Hide All Messages
**Steps:**
1. Show error message
2. Show success message
3. Submit form again

**Expected Result:**
- Previous messages are cleared
- Only new message is shown
- No duplicate messages

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 4: Accessibility Tests

### TC-026: Error Message ARIA Role
**Steps:**
1. Trigger an error
2. Inspect error message element

**Expected Result:**
- Element has `role="alert"`
- Screen reader announces error

**Status:** [ ] Pass [ ] Fail

---

### TC-027: Success Message ARIA Role
**Steps:**
1. Submit valid form
2. Inspect success message element

**Expected Result:**
- Element has `role="status"`
- Screen reader announces success

**Status:** [ ] Pass [ ] Fail

---

### TC-028: Button ARIA Busy State
**Steps:**
1. Submit form
2. Inspect button during submission

**Expected Result:**
- Button has `aria-busy="true"` during submission
- Changes to `aria-busy="false"` after completion

**Status:** [ ] Pass [ ] Fail

---

### TC-029: Password Toggle ARIA Label
**Steps:**
1. Inspect password toggle button
2. Click toggle
3. Inspect again

**Expected Result:**
- Initially: `aria-label="Show password"`
- After click: `aria-label="Hide password"`

**Status:** [ ] Pass [ ] Fail

---

### TC-030: Screen Reader Announcements
**Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Trigger error message
3. Listen for announcement

**Expected Result:**
- Screen reader announces error message
- Announcement is clear and immediate

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 5: Edge Cases

### TC-031: Empty Form Submission
**Steps:**
1. Leave all fields empty
2. Click Login button

**Expected Result:**
- Error message appears
- Both fields show validation errors
- Form does not submit

**Status:** [ ] Pass [ ] Fail

---

### TC-032: Whitespace-Only Username
**Steps:**
1. Enter only spaces in username: "   "
2. Blur the field

**Expected Result:**
- Validation error appears
- Treated as empty field

**Status:** [ ] Pass [ ] Fail

---

### TC-033: Special Characters in Username
**Steps:**
1. Enter: "user_name-123"
2. Blur the field

**Expected Result:**
- No error
- Special characters are accepted

**Status:** [ ] Pass [ ] Fail

---

### TC-034: Password with Spaces
**Steps:**
1. Enter: "pass word 123"
2. Blur the field

**Expected Result:**
- No error
- Spaces are allowed in password

**Status:** [ ] Pass [ ] Fail

---

### TC-035: Network Error Handling
**Steps:**
1. Open DevTools Network tab
2. Set network to "Offline"
3. Submit form

**Expected Result:**
- Error message appears
- User is informed of connection issue
- Form remains filled

**Status:** [ ] Pass [ ] Fail

---

## Test Suite 6: Responsive Design Tests

### TC-036: Mobile View (320px)
**Steps:**
1. Resize browser to 320px width
2. Observe layout

**Expected Result:**
- Form is fully visible
- No horizontal scrolling
- Buttons are touch-friendly

**Status:** [ ] Pass [ ] Fail

---

### TC-037: Tablet View (768px)
**Steps:**
1. Resize browser to 768px width
2. Observe layout

**Expected Result:**
- Form is centered
- Proper spacing maintained
- All elements visible

**Status:** [ ] Pass [ ] Fail

---

### TC-038: Desktop View (1920px)
**Steps:**
1. View on large desktop screen
2. Observe layout

**Expected Result:**
- Form is centered with max-width
- Not stretched too wide
- Proper proportions maintained

**Status:** [ ] Pass [ ] Fail

---

### TC-039: Keyboard Navigation
**Steps:**
1. Use Tab key to navigate through form
2. Use Enter to submit

**Expected Result:**
- All fields are reachable via Tab
- Focus indicators are visible
- Enter key submits form

**Status:** [ ] Pass [ ] Fail

---

### TC-040: Touch Interactions (Mobile)
**Steps:**
1. Test on mobile device or touch simulator
2. Tap all interactive elements

**Expected Result:**
- All buttons respond to touch
- No double-tap required
- Touch targets are adequate size (44x44px minimum)

**Status:** [ ] Pass [ ] Fail

---

## Test Execution Summary

**Date:** _______________  
**Tester:** _______________  
**Browser:** _______________  
**OS:** _______________

**Results:**
- Total Tests: 40
- Passed: _____
- Failed: _____
- Blocked: _____
- Not Executed: _____

**Overall Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________
_________________________________
_________________________________

**Sign-off:**
_________________________________

