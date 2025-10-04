# Quick Testing Checklist

Use this for rapid testing before deployment.

## Prerequisites
- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] MongoDB connected
- [ ] Firebase configured

## Critical Path Tests (15 minutes)

### 1. Authentication (3 min)
- [ ] Register new user works
- [ ] Login with credentials works
- [ ] Logout works
- [ ] Protected routes redirect when not logged in

### 2. Pet Management (3 min)
- [ ] Add new pet works
- [ ] View pets on dashboard
- [ ] Edit pet information
- [ ] Delete pet (optional - use test data)

### 3. Symptom Checker (2 min)
- [ ] Enter symptoms and get AI analysis
- [ ] Results display correctly
- [ ] Upload photo option works

### 4. Appointments (3 min)
- [ ] Book new appointment
- [ ] Appointment appears on dashboard
- [ ] Appointment details correct

### 5. Admin Features (2 min) - Admin account only
- [ ] Access admin dashboard
- [ ] View statistics (users, vets, appointments, pets)
- [ ] User list loads
- [ ] Can change user role

### 6. Error Handling (2 min)
- [ ] Invalid login shows error
- [ ] Empty form shows validation
- [ ] Network error handled gracefully (optional - stop backend briefly)

## Smoke Test Results

**Date:** ________________
**Tester:** ________________
**Status:** ☐ PASS ☐ FAIL

**Critical Issues Found:**
______________________________________
______________________________________
______________________________________

**Ready for Deployment:** ☐ YES ☐ NO
