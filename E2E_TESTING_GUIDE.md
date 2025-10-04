# End-to-End Testing Guide

## Overview

This document provides a comprehensive testing checklist for the HappyTails application. Test all features in the order presented to ensure complete functionality.

## Prerequisites

### Before Testing

1. **Backend Running**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   - Should see: "Server running on port 5000"
   - Should see: "MongoDB connected successfully"
   - Should see: "Firebase Admin SDK initialized"

2. **Frontend Running**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Should see: "Local: http://localhost:8080"
   - Browser should auto-open to homepage

3. **Clean Database**
   - For fresh testing, consider clearing test users from MongoDB
   - Keep demo accounts from `DEMO_ACCOUNTS.md` for testing

4. **Test Credentials Ready**
   - Regular user credentials
   - Vet credentials (if available)
   - Admin credentials

---

## Test Suite 1: Authentication & Authorization

### Test 1.1: User Registration ✓

**Steps:**
1. Navigate to homepage (`http://localhost:8080`)
2. Click "Get Started" or "Sign Up" button
3. Fill in registration form:
   - Full Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "TestPass123!"
   - Pet Name (optional): "Buddy"
   - Pet Type (optional): "Dog"
4. Click "Create Account"

**Expected Results:**
- ✓ Firebase creates user account
- ✓ Backend creates user record in MongoDB
- ✓ User is redirected to User Dashboard
- ✓ Toast notification: "Welcome to HappyTails!"
- ✓ JWT token stored in localStorage as 'happytails_token'

**Verification:**
- Check localStorage in browser DevTools
- Check MongoDB `users` collection for new user
- User role should be 'user'

---

### Test 1.2: User Login ✓

**Steps:**
1. If logged in, log out first
2. Navigate to `/login`
3. Enter credentials:
   - Email: "testuser@example.com"
   - Password: "TestPass123!"
4. Click "Sign In"

**Expected Results:**
- ✓ Firebase authenticates user
- ✓ Backend validates and returns JWT token
- ✓ User redirected to User Dashboard
- ✓ Toast notification: "Welcome back!"
- ✓ User info displayed in header

---

### Test 1.3: Protected Routes ✓

**Steps:**
1. Log out completely
2. Try accessing these URLs directly:
   - `/pet-records` → Should redirect to login
   - `/user-dashboard` → Should redirect to login
   - `/book-appointment` → Should redirect to login
   - `/admin-dashboard` → Should redirect to login

**Expected Results:**
- ✓ Unauthenticated users redirected to login
- ✓ Auth prompt shown with "Sign In Required" message
- ✓ After login, user redirected back to original page

---

### Test 1.4: Role-Based Authorization ✓

**Steps:**
1. Log in as regular user
2. Try accessing `/admin-dashboard`

**Expected Results:**
- ✓ Access denied page shown
- ✓ Message: "Administrator Access Required"
- ✓ "Return to Home" button available
- ✓ User current role displayed

---

### Test 1.5: Logout ✓

**Steps:**
1. Log in as any user
2. Click user menu in header
3. Click "Logout"

**Expected Results:**
- ✓ JWT token removed from localStorage
- ✓ Firebase signs out user
- ✓ Redirected to homepage
- ✓ Header shows "Sign In" button

---

## Test Suite 2: Pet Management

### Test 2.1: Add New Pet ✓

**Steps:**
1. Log in as user
2. Navigate to `/pet-records`
3. Click "Add New Pet" button
4. Fill in pet details:
   - Name: "Max"
   - Species: "Dog"
   - Breed: "Golden Retriever"
   - Age: "3"
   - Weight: "30"
   - Medical History: "Vaccinations up to date"
5. Click "Add Pet" (or "Save")

**Expected Results:**
- ✓ Loading state shown during API call
- ✓ Toast notification: "Pet added successfully!"
- ✓ Pet card appears in the list
- ✓ Pet stored in MongoDB with user reference

**Verification:**
- Check MongoDB `pets` collection
- Pet should have correct `owner` field (user ID)

---

### Test 2.2: View Pet Details ✓

**Steps:**
1. On Pet Records page
2. Find "Max" pet card
3. Review displayed information

**Expected Results:**
- ✓ Pet name displayed prominently
- ✓ Species and breed shown
- ✓ Age and weight displayed
- ✓ Medical history visible
- ✓ Edit and Delete buttons available

---

### Test 2.3: Edit Pet ✓

**Steps:**
1. Click "Edit" button on Max's card
2. Update details:
   - Age: "4"
   - Weight: "32"
3. Click "Save" or "Update"

**Expected Results:**
- ✓ Loading state shown
- ✓ Toast notification: "Pet updated successfully!"
- ✓ Updated information displayed immediately
- ✓ Database record updated

---

### Test 2.4: Delete Pet ✓

**Steps:**
1. Click "Delete" button on a pet card
2. Confirm deletion in dialog

**Expected Results:**
- ✓ Confirmation dialog appears
- ✓ After confirmation, loading state shown
- ✓ Toast notification: "Pet deleted successfully!"
- ✓ Pet card removed from UI
- ✓ Pet removed from database

---

## Test Suite 3: Symptom Checker (AI Feature)

### Test 3.1: Symptom Analysis (Text Only) ✓

**Steps:**
1. Navigate to `/symptom-checker`
2. Select pet: "Max"
3. Select symptom category: "Digestive"
4. Enter symptoms: "My dog has been vomiting and has diarrhea for 2 days"
5. Click "Analyze Symptoms"

**Expected Results:**
- ✓ Loading skeleton shown during analysis
- ✓ Gemini AI processes request
- ✓ Results displayed with:
  - Analysis text
  - Urgency level indicator
  - Recommendations
  - Disclaimer notice
- ✓ Toast notification on completion

**Verification:**
- Check backend logs for Gemini API call
- Response should be coherent and relevant

---

### Test 3.2: Symptom Analysis (With Photo) ✓

**Steps:**
1. On Symptom Checker page
2. Upload a pet photo (any image file)
3. Enter symptoms describing the image
4. Click "Analyze Symptoms"

**Expected Results:**
- ✓ Image uploaded successfully
- ✓ Gemini processes both text and image
- ✓ Results consider visual information
- ✓ Photo displayed in results

---

## Test Suite 4: Find Veterinarians

### Test 4.1: Browse All Vets ✓

**Steps:**
1. Navigate to `/vets`
2. View the vet listings

**Expected Results:**
- ✓ List of vets loaded from backend
- ✓ Each vet card shows:
  - Name
  - Specialization
  - Experience years
  - Phone number
  - Location
  - Verified badge (if verified)
- ✓ Loading skeletons shown while loading

---

### Test 4.2: Search Vets by Location ✓

**Steps:**
1. On Vets page
2. Allow browser location access if prompted
3. Click "Use My Location" (if available)
4. Or enter location manually

**Expected Results:**
- ✓ Vets sorted by distance (if geolocation used)
- ✓ Nearby vets displayed first
- ✓ Distance information shown (if available)

---

## Test Suite 5: Appointments

### Test 5.1: Book Appointment ✓

**Steps:**
1. Log in as user with pets
2. Navigate to `/book-appointment`
3. Fill in appointment form:
   - Select Pet: "Max"
   - Select Vet: Choose any vet from dropdown
   - Date: Tomorrow's date
   - Time: "10:00 AM"
   - Reason: "Annual checkup"
4. Click "Book Appointment"

**Expected Results:**
- ✓ Pet list loaded from backend
- ✓ Vet list loaded from backend
- ✓ Date picker works correctly
- ✓ Toast notification: "Appointment booked successfully!"
- ✓ Redirected to User Dashboard
- ✓ Appointment appears in database

**Verification:**
- Check MongoDB `appointments` collection
- Appointment should have:
  - User reference
  - Pet reference
  - Vet reference
  - Date, time, reason
  - Status: "pending"

---

### Test 5.2: View Appointments ✓

**Steps:**
1. Navigate to `/user-dashboard`
2. Scroll to appointments section

**Expected Results:**
- ✓ All user's appointments displayed
- ✓ Each appointment shows:
  - Pet name
  - Vet name
  - Date and time
  - Reason
  - Status badge (color-coded)
- ✓ Empty state if no appointments

---

### Test 5.3: Appointment Status Display ✓

**Expected Status Colors:**
- ✓ Pending: Yellow/Warning badge
- ✓ Confirmed: Blue/Info badge
- ✓ Completed: Green/Success badge
- ✓ Cancelled: Red/Destructive badge

---

## Test Suite 6: Educational Resources

### Test 6.1: Browse Articles ✓

**Steps:**
1. Navigate to `/resources`
2. Browse article list

**Expected Results:**
- ✓ Articles loaded from backend
- ✓ Each article shows:
  - Title
  - Category
  - Excerpt/Description
  - Published badge
  - Author (if available)
- ✓ Loading state shown initially

---

### Test 6.2: Filter by Category ✓

**Steps:**
1. On Resources page
2. Click different category tabs

**Expected Results:**
- ✓ Articles filtered by selected category
- ✓ Active tab highlighted
- ✓ Filter happens instantly (client-side)

---

### Test 6.3: Search Articles ✓

**Steps:**
1. On Resources page
2. Enter search term in search box
3. Type: "dog care"

**Expected Results:**
- ✓ Articles filtered by search term
- ✓ Search matches title and content
- ✓ Results update as you type

---

## Test Suite 7: User Dashboard

### Test 7.1: Dashboard Overview ✓

**Steps:**
1. Log in and navigate to `/user-dashboard`

**Expected Results:**
- ✓ User pets section displays all pets
- ✓ Upcoming appointments section shows appointments
- ✓ Loading skeletons during data fetch
- ✓ Empty states shown if no data

---

### Test 7.2: Quick Actions ✓

**Steps:**
1. From User Dashboard, test quick action buttons

**Expected Results:**
- ✓ "Add Pet" button → navigates to Pet Records
- ✓ "Book Appointment" button → navigates to appointment form
- ✓ "Use Symptom Checker" button → navigates to Symptom Checker

---

## Test Suite 8: Admin Dashboard (Admin Only)

### Test 8.1: Admin Access ✓

**Steps:**
1. Log in with admin credentials
2. Navigate to `/admin-dashboard`

**Expected Results:**
- ✓ Admin user can access dashboard
- ✓ Regular users see "Access Denied"

---

### Test 8.2: View Statistics ✓

**Steps:**
1. On Admin Dashboard, view stats cards

**Expected Results:**
- ✓ Total Users count displayed
- ✓ Total Vets count displayed
- ✓ Total Appointments count displayed
- ✓ Total Pets count displayed
- ✓ Numbers loaded from backend API

---

### Test 8.3: User Management ✓

**Steps:**
1. Navigate to Users tab in Admin Dashboard
2. View user list

**Expected Results:**
- ✓ All users loaded from backend
- ✓ Each user shows:
  - Email
  - Role badge
  - Registration date
  - Status (Active/Banned)
- ✓ Action buttons available

---

### Test 8.4: Change User Role ✓

**Steps:**
1. Find a test user in user list
2. Change role dropdown from "user" to "vet"
3. Observe changes

**Expected Results:**
- ✓ Dropdown updates immediately
- ✓ API call made to update role
- ✓ Toast notification on success
- ✓ Role badge updates
- ✓ Database updated

---

### Test 8.5: Ban/Unban User ✓

**Steps:**
1. Find a test user
2. Click "Ban" button
3. Click "Unban" button

**Expected Results:**
- ✓ Ban: Status changes to "Banned" (red badge)
- ✓ Toast notification
- ✓ Button changes to "Unban"
- ✓ Unban: Status changes to "Active" (green badge)
- ✓ Database `isBanned` field updated

---

### Test 8.6: Delete User ✓

**Steps:**
1. Find a test user
2. Click "Delete" button
3. Confirm in dialog

**Expected Results:**
- ✓ Confirmation required
- ✓ User removed from list
- ✓ Toast notification
- ✓ User deleted from database

---

## Test Suite 9: Error Handling

### Test 9.1: Network Error Handling ✓

**Steps:**
1. Stop backend server
2. Try any API action (e.g., add pet)

**Expected Results:**
- ✓ Request fails gracefully
- ✓ Error toast notification shown
- ✓ Retry logic attempts (check console)
- ✓ No app crash

---

### Test 9.2: Invalid Input Handling ✓

**Steps:**
1. Try submitting forms with invalid data
2. Empty required fields
3. Invalid email format

**Expected Results:**
- ✓ Validation errors shown
- ✓ Form submission prevented
- ✓ Clear error messages

---

### Test 9.3: 401 Unauthorized Handling ✓

**Steps:**
1. Manually delete JWT token from localStorage
2. Try accessing protected route

**Expected Results:**
- ✓ Redirected to login
- ✓ Token cleared
- ✓ Return path preserved

---

### Test 9.4: React Error Boundary ✓

**Steps:**
1. Trigger a React error (if possible)

**Expected Results:**
- ✓ Error boundary catches error
- ✓ Beautiful error page shown
- ✓ "Return to Home" and "Reload" buttons work
- ✓ Error details expandable for developers

---

## Test Suite 10: Cross-Browser Testing

### Test 10.1: Chrome ✓
- Test all major features in Chrome
- Check console for errors
- Verify all styles render correctly

### Test 10.2: Firefox ✓
- Test authentication flow
- Test API calls
- Check for console errors

### Test 10.3: Edge ✓
- Test basic functionality
- Verify compatibility

### Test 10.4: Safari (Mac) ✓
- Test if available
- Check for any Safari-specific issues

---

## Test Suite 11: Responsive Design

### Test 11.1: Mobile View (375px) ✓
- Navigation menu collapses
- Forms are usable
- Cards stack vertically
- Text readable

### Test 11.2: Tablet View (768px) ✓
- Layout adapts appropriately
- Grids adjust column count
- Touch targets adequate size

### Test 11.3: Desktop View (1920px) ✓
- Maximum width constraints work
- Content doesn't stretch too wide
- All features accessible

---

## Test Suite 12: Performance

### Test 12.1: Load Time ✓
- Homepage loads < 3 seconds
- API responses < 2 seconds
- Images load progressively

### Test 12.2: Loading States ✓
- Skeleton screens shown during loading
- No layout shift
- Smooth transitions

---

## Common Issues & Solutions

### Issue: "CORS Error"
**Solution:** 
- Check backend is running on port 5000
- Verify frontend is on allowed origin
- Check backend logs

### Issue: "Firebase Error"
**Solution:**
- Verify Firebase config in `.env`
- Check Firebase console
- Ensure service account is valid

### Issue: "MongoDB Connection Failed"
**Solution:**
- Check MongoDB is running
- Verify connection string
- Check network/firewall

### Issue: "JWT Token Invalid"
**Solution:**
- Clear localStorage
- Log in again
- Check JWT_SECRET matches

---

## Test Results Template

Copy this template to document your test results:

```
Date: YYYY-MM-DD
Tester: [Your Name]
Environment: Development

✅ = Pass | ❌ = Fail | ⚠️ = Warning

[ ] Test Suite 1: Authentication & Authorization
  [ ] 1.1 User Registration
  [ ] 1.2 User Login
  [ ] 1.3 Protected Routes
  [ ] 1.4 Role-Based Authorization
  [ ] 1.5 Logout

[ ] Test Suite 2: Pet Management
  [ ] 2.1 Add New Pet
  [ ] 2.2 View Pet Details
  [ ] 2.3 Edit Pet
  [ ] 2.4 Delete Pet

[ ] Test Suite 3: Symptom Checker
  [ ] 3.1 Text Analysis
  [ ] 3.2 Photo Analysis

[ ] Test Suite 4: Find Veterinarians
  [ ] 4.1 Browse All Vets
  [ ] 4.2 Search by Location

[ ] Test Suite 5: Appointments
  [ ] 5.1 Book Appointment
  [ ] 5.2 View Appointments
  [ ] 5.3 Status Display

[ ] Test Suite 6: Educational Resources
  [ ] 6.1 Browse Articles
  [ ] 6.2 Filter by Category
  [ ] 6.3 Search Articles

[ ] Test Suite 7: User Dashboard
  [ ] 7.1 Dashboard Overview
  [ ] 7.2 Quick Actions

[ ] Test Suite 8: Admin Dashboard
  [ ] 8.1 Admin Access
  [ ] 8.2 View Statistics
  [ ] 8.3 User Management
  [ ] 8.4 Change User Role
  [ ] 8.5 Ban/Unban User
  [ ] 8.6 Delete User

[ ] Test Suite 9: Error Handling
  [ ] 9.1 Network Errors
  [ ] 9.2 Invalid Input
  [ ] 9.3 401 Unauthorized
  [ ] 9.4 Error Boundary

Notes:
[Add any issues or observations here]
```

---

## Automated Testing (Future)

For production readiness, consider adding:
- Jest unit tests for components
- React Testing Library for integration tests
- Cypress or Playwright for E2E automation
- API endpoint tests with Supertest

---

## Sign-off

Once all tests pass:
- [ ] All test suites completed
- [ ] No critical issues
- [ ] Performance acceptable
- [ ] Ready for production deployment

Approved by: _______________
Date: _______________
