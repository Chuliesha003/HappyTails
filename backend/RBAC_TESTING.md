# RBAC Testing Guide

## Prerequisites
- Server running on http://localhost:5000
- MongoDB running
- Firebase credentials configured
- Test users created with different roles:
  - Regular user (role: 'user')
  - Admin user (role: 'admin')
  - Vet user (role: 'vet')

## Test Environment Setup

### Create Test Users
Use Firebase Console or authentication endpoints to create:
1. test-user@happytails.com (role: user)
2. test-admin@happytails.com (role: admin)
3. test-vet@happytails.com (role: vet)

Get Firebase ID tokens for each user for testing.

## Test Cases

### 1. Authentication Middleware Tests

#### Test 1.1: No Token Provided
```bash
curl -X GET http://localhost:5000/api/pets
```
**Expected**: 401 - "No token provided"

#### Test 1.2: Invalid Token Format
```bash
curl -X GET http://localhost:5000/api/pets \
  -H "Authorization: InvalidToken"
```
**Expected**: 401 - "Invalid token format"

#### Test 1.3: Expired Token
```bash
curl -X GET http://localhost:5000/api/pets \
  -H "Authorization: Bearer expired_token_here"
```
**Expected**: 401 - "Token has expired"

#### Test 1.4: Valid Token
```bash
curl -X GET http://localhost:5000/api/pets \
  -H "Authorization: Bearer valid_user_token_here"
```
**Expected**: 200 - Returns user's pets

### 2. Role-Based Authorization Tests

#### Test 2.1: Regular User Accessing Admin Route
```bash
curl -X POST http://localhost:5000/api/vets \
  -H "Authorization: Bearer user_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test Vet",
    "email": "test@vet.com",
    "phoneNumber": "1234567890",
    "clinicName": "Test Clinic",
    "specialization": ["general"],
    "licenseNumber": "VET12345"
  }'
```
**Expected**: 403 - "Access denied. Required roles: admin"

#### Test 2.2: Admin User Accessing Admin Route
```bash
curl -X POST http://localhost:5000/api/vets \
  -H "Authorization: Bearer admin_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test Vet",
    "email": "test@vet.com",
    "phoneNumber": "1234567890",
    "clinicName": "Test Clinic",
    "specialization": ["general"],
    "licenseNumber": "VET12345"
  }'
```
**Expected**: 201 - Vet created successfully

#### Test 2.3: Admin Updating Article
```bash
curl -X PUT http://localhost:5000/api/resources/{article_id} \
  -H "Authorization: Bearer admin_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Article Title"
  }'
```
**Expected**: 200 - Article updated successfully

#### Test 2.4: Regular User Updating Article
```bash
curl -X PUT http://localhost:5000/api/resources/{article_id} \
  -H "Authorization: Bearer user_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Article Title"
  }'
```
**Expected**: 403 - "Access denied"

### 3. Ownership Verification Tests

#### Test 3.1: User Accessing Own Pet
```bash
curl -X GET http://localhost:5000/api/pets/{own_pet_id} \
  -H "Authorization: Bearer user_token_here"
```
**Expected**: 200 - Returns pet details

#### Test 3.2: User Accessing Another User's Pet
```bash
curl -X GET http://localhost:5000/api/pets/{other_user_pet_id} \
  -H "Authorization: Bearer user_token_here"
```
**Expected**: 403 or 404 - "Pet not found" or "Access denied"

#### Test 3.3: User Updating Own Pet
```bash
curl -X PUT http://localhost:5000/api/pets/{own_pet_id} \
  -H "Authorization: Bearer user_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Pet Name"
  }'
```
**Expected**: 200 - Pet updated successfully

#### Test 3.4: User Updating Another User's Pet
```bash
curl -X PUT http://localhost:5000/api/pets/{other_user_pet_id} \
  -H "Authorization: Bearer user_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Pet Name"
  }'
```
**Expected**: 403 or 404 - Access denied

#### Test 3.5: User Cancelling Own Appointment
```bash
curl -X DELETE http://localhost:5000/api/appointments/{own_appointment_id} \
  -H "Authorization: Bearer user_token_here"
```
**Expected**: 200 - Appointment cancelled (if within policy)

#### Test 3.6: User Cancelling Another User's Appointment
```bash
curl -X DELETE http://localhost:5000/api/appointments/{other_user_appointment_id} \
  -H "Authorization: Bearer user_token_here"
```
**Expected**: 403 or 404 - Access denied

### 4. Optional Authentication Tests

#### Test 4.1: Guest Viewing Published Articles
```bash
curl -X GET http://localhost:5000/api/resources
```
**Expected**: 200 - Returns published articles

#### Test 4.2: Guest Viewing Unpublished Article
```bash
curl -X GET http://localhost:5000/api/resources/{unpublished_article_id}
```
**Expected**: 403 - "This article is not published"

#### Test 4.3: Admin Viewing Unpublished Article
```bash
curl -X GET http://localhost:5000/api/resources/{unpublished_article_id} \
  -H "Authorization: Bearer admin_token_here"
```
**Expected**: 200 - Returns unpublished article

#### Test 4.4: Guest Using Symptom Checker (First Time)
```bash
curl -X POST http://localhost:5000/api/symptom-checker/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "petType": "dog",
    "symptoms": "coughing, lethargy",
    "duration": "2 days",
    "severity": "moderate"
  }'
```
**Expected**: 200 - Returns analysis (count: 1/3)

#### Test 4.5: Guest Exceeding Usage Limit
```bash
# After 3 uses
curl -X POST http://localhost:5000/api/symptom-checker/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "petType": "dog",
    "symptoms": "coughing",
    "duration": "2 days",
    "severity": "moderate"
  }'
```
**Expected**: 403 - "Usage limit reached"

#### Test 4.6: Guest Accessing Emergency Endpoint
```bash
curl -X POST http://localhost:5000/api/symptom-checker/emergency \
  -H "Content-Type: application/json" \
  -d '{
    "petType": "dog",
    "symptoms": "seizure, unconscious",
    "duration": "just now",
    "severity": "critical"
  }'
```
**Expected**: 200 - Returns emergency assessment (unlimited access)

### 5. Public Route Tests

#### Test 5.1: Guest Viewing Vets
```bash
curl -X GET http://localhost:5000/api/vets
```
**Expected**: 200 - Returns list of vets

#### Test 5.2: Guest Viewing Vet Details
```bash
curl -X GET http://localhost:5000/api/vets/{vet_id}
```
**Expected**: 200 - Returns vet details with reviews

#### Test 5.3: Guest Adding Review (Should Fail)
```bash
curl -X POST http://localhost:5000/api/vets/{vet_id}/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great vet!"
  }'
```
**Expected**: 401 - "No token provided"

#### Test 5.4: Authenticated User Adding Review
```bash
curl -X POST http://localhost:5000/api/vets/{vet_id}/reviews \
  -H "Authorization: Bearer user_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great vet!"
  }'
```
**Expected**: 201 - Review added successfully

### 6. Admin Operations Tests

#### Test 6.1: Admin Deleting Vet
```bash
curl -X DELETE http://localhost:5000/api/vets/{vet_id} \
  -H "Authorization: Bearer admin_token_here"
```
**Expected**: 200 - Vet deleted successfully

#### Test 6.2: Admin Creating Article
```bash
curl -X POST http://localhost:5000/api/resources \
  -H "Authorization: Bearer admin_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pet Nutrition Guide",
    "content": "Detailed content about pet nutrition...",
    "category": "nutrition",
    "tags": ["nutrition", "diet", "health"],
    "isPublished": true
  }'
```
**Expected**: 201 - Article created successfully

#### Test 6.3: Admin Deleting Article
```bash
curl -X DELETE http://localhost:5000/api/resources/{article_id} \
  -H "Authorization: Bearer admin_token_here"
```
**Expected**: 200 - Article deleted successfully

#### Test 6.4: Admin Toggling Publish Status
```bash
curl -X PATCH http://localhost:5000/api/resources/{article_id}/publish \
  -H "Authorization: Bearer admin_token_here"
```
**Expected**: 200 - Article published/unpublished

### 7. Edge Cases

#### Test 7.1: User with Changed Role
1. Create user with role 'user'
2. Get token
3. Access admin route (should fail)
4. Change role to 'admin' in database
5. Try again with same token (should succeed now)

**Expected**: Role is fetched from database on each request, so updated role takes effect immediately

#### Test 7.2: Inactive User
1. Set user.isActive = false in database
2. Try to access protected routes
3. (Future enhancement - currently not implemented)

**Expected**: Access should be denied for inactive users

#### Test 7.3: User Deleted in Database but Has Valid Token
1. Delete user from database
2. Try to access protected routes with valid Firebase token

**Expected**: 404 - "User not found in database"

## Automated Testing Script

Create a test file `test-rbac.sh`:

```bash
#!/bin/bash

# Configuration
API_URL="http://localhost:5000"
USER_TOKEN="your_user_token_here"
ADMIN_TOKEN="your_admin_token_here"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Starting RBAC Tests..."

# Test 1: No token
echo -e "\nTest 1: No token provided"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/pets)
if [ $RESPONSE -eq 401 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Got 401 as expected"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 401, got $RESPONSE"
fi

# Test 2: Valid user token
echo -e "\nTest 2: Valid user token"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $USER_TOKEN" $API_URL/api/pets)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Got 200 as expected"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 200, got $RESPONSE"
fi

# Test 3: User accessing admin route
echo -e "\nTest 3: User accessing admin route"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $USER_TOKEN" -X POST $API_URL/api/vets)
if [ $RESPONSE -eq 403 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Got 403 as expected"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 403, got $RESPONSE"
fi

# Test 4: Admin accessing admin route
echo -e "\nTest 4: Admin accessing admin route"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -X POST $API_URL/api/vets -d '{"name":"Test Vet","email":"test@vet.com","phoneNumber":"1234567890","clinicName":"Test Clinic","specialization":["general"],"licenseNumber":"VET12345"}')
if [ $RESPONSE -eq 201 ] || [ $RESPONSE -eq 400 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Got expected response ($RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 201 or 400, got $RESPONSE"
fi

# Test 5: Public route (guest)
echo -e "\nTest 5: Public route (guest)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/vets)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Got 200 as expected"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 200, got $RESPONSE"
fi

echo -e "\nTests completed!"
```

## Manual Testing Checklist

- [ ] Test authentication with no token
- [ ] Test authentication with invalid token
- [ ] Test authentication with expired token
- [ ] Test authentication with valid token
- [ ] Test regular user accessing admin routes (should fail)
- [ ] Test admin accessing admin routes (should succeed)
- [ ] Test user accessing own resources (should succeed)
- [ ] Test user accessing other's resources (should fail)
- [ ] Test guest accessing public routes (should succeed)
- [ ] Test guest accessing protected routes (should fail)
- [ ] Test guest with symptom checker usage limits
- [ ] Test role change taking effect immediately
- [ ] Test all admin-only endpoints with admin token
- [ ] Test all admin-only endpoints with regular user token

## Security Verification

✅ All protected routes require authentication  
✅ Admin routes require admin role  
✅ Ownership is verified for user resources  
✅ Role is fetched from database (not token)  
✅ Proper error messages don't leak sensitive info  
✅ Token expiration is handled correctly  
✅ Invalid tokens are rejected  
✅ Guest limits are enforced  
✅ Public routes don't expose sensitive data  
✅ Middleware is properly chained  

## Notes

- All tests should be run with real Firebase tokens
- Create test users in Firebase Authentication console
- Set user roles directly in MongoDB for testing
- Clean up test data after testing
- Monitor server logs for any errors during testing
