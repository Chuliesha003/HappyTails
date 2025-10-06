# HappyTails - Complete Database Schema & Data Flow Documentation

## 📊 Database Collections Overview

Based on complete project analysis, here are ALL required MongoDB collections:

### ✅ EXISTING Collections (Already Implemented)

1. **users** - User accounts and profiles
2. **pets** - Pet records with medical history
3. **vets** - Veterinarian profiles and clinics
4. **appointments** - Booking and scheduling
5. **articles** - Educational resources

### 🆕 MISSING Collections (Need to be Created)

6. **symptomchecks** - AI symptom analysis history
7. **reviews** - Vet and service reviews
8. **notifications** - User notifications and alerts
9. **vaccinations** - Pet vaccination records (separate from pets for better tracking)
10. **prescriptions** - Medication prescriptions
11. **payments** - Payment transactions (if implementing)
12. **activitylogs** - Admin activity tracking

---

## 📋 Detailed Schema Definitions

### 1. Users Collection ✅ (Exists)
**File**: `backend/models/User.js`

```javascript
{
  _id: ObjectId,
  firebaseUid: String (unique, indexed),
  email: String (unique, indexed),
  fullName: String (required),
  role: String (enum: ['user', 'vet', 'admin'], default: 'user'),
  pets: [ObjectId] (ref: 'Pet'),
  phoneNumber: String,
  profileImage: String (Firebase Storage URL),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  guestUsageCount: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: firebaseUid, email, role

---

### 2. Pets Collection ✅ (Exists)
**File**: `backend/models/Pet.js`

```javascript
{
  _id: ObjectId,
  owner: ObjectId (ref: 'User', required, indexed),
  name: String (required),
  species: String (enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Fish', 'Reptile', 'Other']),
  breed: String (required),
  age: Number,
  ageUnit: String (enum: ['years', 'months', 'weeks']),
  dateOfBirth: Date,
  weight: Number,
  weightUnit: String (enum: ['kg', 'lbs']),
  gender: String (enum: ['male', 'female']),
  color: String,
  microchipId: String,
  profileImage: String (Firebase Storage URL),
  medicalHistory: [{
    date: Date,
    condition: String,
    diagnosis: String,
    treatment: String,
    veterinarian: String,
    notes: String,
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }]
  }],
  vaccinations: [{
    name: String,
    date: Date,
    nextDueDate: Date,
    administeredBy: String,
    notes: String
  }],
  allergies: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: owner, species, isActive

---

### 3. Vets Collection ✅ (Exists)
**File**: `backend/models/Vet.js`

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  phoneNumber: String (required),
  clinicName: String (required),
  specialization: [String] (required, min 1),
  licenseNumber: String (unique, required, indexed),
  yearsOfExperience: Number,
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  location: {
    address: String (required),
    city: String (required),
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  availability: [{
    day: String (enum: weekdays),
    startTime: String (HH:MM format),
    endTime: String (HH:MM format),
    isAvailable: Boolean
  }],
  consultationFee: Number,
  rating: Number (0-5, default: 0),
  reviewCount: Number (default: 0),
  reviews: [{
    user: ObjectId (ref: 'User'),
    rating: Number (1-5),
    comment: String,
    createdAt: Date
  }],
  bio: String (max: 1000),
  profileImage: String,
  services: [String],
  languages: [String],
  emergencyService: Boolean,
  houseCallService: Boolean,
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: email, licenseNumber, location (geospatial), rating

---

### 4. Appointments Collection ✅ (Exists)
**File**: `backend/models/Appointment.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  vet: ObjectId (ref: 'Vet', required, indexed),
  pet: ObjectId (ref: 'Pet', required),
  dateTime: Date (required, indexed),
  duration: Number (minutes, default: 30),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'], indexed),
  reason: String (required, max: 500),
  symptoms: String (max: 1000),
  notes: String (max: 1000),
  diagnosis: String,
  treatment: String,
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  followUpDate: Date,
  cancellationReason: String,
  cancelledBy: ObjectId (ref: 'User'),
  cancelledAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: user, vet, pet, dateTime, status

---

### 5. Articles Collection ✅ (Exists)
**File**: `backend/models/Article.js`

```javascript
{
  _id: ObjectId,
  title: String (required, min: 10, max: 200),
  slug: String (unique, indexed),
  content: String (required, min: 100),
  excerpt: String (max: 500),
  category: String (enum: ['nutrition', 'diseases', 'training', 'grooming', 'behavior', 'general'], indexed),
  tags: [String],
  author: ObjectId (ref: 'User'),
  authorName: String,
  imageUrl: String,
  videoUrl: String,
  readTime: Number (minutes),
  views: Number (default: 0),
  likes: Number (default: 0),
  isPublished: Boolean (default: false, indexed),
  isFeatured: Boolean (default: false),
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: slug, category, isPublished, tags

---

### 6. SymptomChecks Collection 🆕 (NEEDS CREATION)
**Purpose**: Store AI symptom analysis history for users

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  pet: ObjectId (ref: 'Pet'),
  symptoms: String (required, max: 2000),
  imageUrl: String (Firebase Storage URL if image uploaded),
  aiResponse: {
    possibleConditions: [{
      name: String,
      severity: String (enum: ['low', 'moderate', 'high', 'emergency']),
      confidence: Number (0-100),
      description: String,
      recommendations: [String]
    }],
    urgencyLevel: String (enum: ['low', 'medium', 'high', 'emergency']),
    recommendations: [String],
    disclaimer: String
  },
  followUpAction: String (enum: ['none', 'monitor', 'schedule', 'emergency']),
  appointmentBooked: Boolean (default: false),
  relatedAppointment: ObjectId (ref: 'Appointment'),
  createdAt: Date
}
```

**Indexes**: user, pet, createdAt

**Data Flow**:
- Frontend: `SymptomChecker.tsx` → `symptomService.checkSymptoms()`
- Backend: POST `/api/symptoms/check` → `symptomController.checkSymptoms()`
- Stores user symptom check history for tracking and follow-up

---

### 7. Reviews Collection 🆕 (NEEDS CREATION)
**Purpose**: Separate vet reviews from vet documents for better management

```javascript
{
  _id: ObjectId,
  vet: ObjectId (ref: 'Vet', required, indexed),
  user: ObjectId (ref: 'User', required, indexed),
  appointment: ObjectId (ref: 'Appointment'),
  rating: Number (1-5, required),
  comment: String (max: 1000),
  response: {
    text: String,
    respondedBy: ObjectId (ref: 'User'),
    respondedAt: Date
  },
  isVerified: Boolean (default: false),
  isPublished: Boolean (default: true),
  helpful: Number (default: 0),
  notHelpful: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: vet, user, rating, createdAt

---

### 8. Notifications Collection 🆕 (NEEDS CREATION)
**Purpose**: User notifications and alerts

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  type: String (enum: ['appointment', 'vaccination', 'medication', 'general', 'system'], indexed),
  title: String (required),
  message: String (required),
  link: String,
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  isRead: Boolean (default: false, indexed),
  readAt: Date,
  relatedEntity: {
    model: String (enum: ['Appointment', 'Pet', 'Vet']),
    id: ObjectId
  },
  createdAt: Date
}
```

**Indexes**: user, type, isRead, createdAt

---

### 9. Vaccinations Collection 🆕 (NEEDS CREATION)
**Purpose**: Separate vaccination tracking with reminders

```javascript
{
  _id: ObjectId,
  pet: ObjectId (ref: 'Pet', required, indexed),
  owner: ObjectId (ref: 'User', required, indexed),
  vaccineName: String (required),
  vaccineType: String (enum: ['core', 'non-core', 'optional']),
  dateAdministered: Date (required),
  nextDueDate: Date (indexed),
  administeredBy: ObjectId (ref: 'Vet'),
  clinicName: String,
  batchNumber: String,
  dose: String,
  boosterRequired: Boolean,
  reminderSent: Boolean (default: false),
  reminderDate: Date,
  notes: String,
  certificate: String (Firebase Storage URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: pet, owner, nextDueDate, reminderSent

---

### 10. Prescriptions Collection 🆕 (NEEDS CREATION)
**Purpose**: Track medication prescriptions

```javascript
{
  _id: ObjectId,
  appointment: ObjectId (ref: 'Appointment', required, indexed),
  pet: ObjectId (ref: 'Pet', required, indexed),
  prescribedBy: ObjectId (ref: 'Vet', required),
  prescribedTo: ObjectId (ref: 'User', required, indexed),
  medications: [{
    name: String (required),
    genericName: String,
    dosage: String (required),
    frequency: String (required),
    route: String (enum: ['oral', 'topical', 'injection', 'other']),
    duration: String,
    quantity: Number,
    refillsAllowed: Number (default: 0),
    instructions: String,
    sideEffects: String,
    warnings: String
  }],
  startDate: Date (required),
  endDate: Date,
  isActive: Boolean (default: true, indexed),
  isFilled: Boolean (default: false),
  filledAt: Date,
  pharmacy: String,
  notes: String,
  document: String (Firebase Storage URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: appointment, pet, prescribedTo, isActive

---

### 11. Payments Collection 🆕 (OPTIONAL - Future Feature)
**Purpose**: Track payment transactions

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  appointment: ObjectId (ref: 'Appointment', required, indexed),
  amount: Number (required),
  currency: String (default: 'USD'),
  paymentMethod: String (enum: ['card', 'paypal', 'cash', 'insurance']),
  status: String (enum: ['pending', 'completed', 'failed', 'refunded'], indexed),
  transactionId: String (unique),
  paymentGateway: String,
  receipt: String (Firebase Storage URL),
  refundAmount: Number,
  refundReason: String,
  refundedAt: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: user, appointment, status, transactionId

---

### 12. ActivityLogs Collection 🆕 (NEEDS CREATION)
**Purpose**: Admin activity tracking and audit trail

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  action: String (required, indexed),
  targetModel: String (enum: ['User', 'Pet', 'Vet', 'Appointment', 'Article']),
  targetId: ObjectId,
  changes: {
    before: Object,
    after: Object
  },
  ipAddress: String,
  userAgent: String,
  description: String,
  createdAt: Date (indexed)
}
```

**Indexes**: user, action, targetModel, createdAt

---

## 🔄 Complete Data Flow Mappings

### Frontend → Backend Data Flow

#### 1. User Registration Flow
**Frontend**: `GetStarted.tsx` (Line 38-58)
```tsx
Form Fields:
- fullName, email, petName, petType, password

handleSubmit() →
  register({ fullName, email, petName, petType, password })
```

**Auth Context**: `AuthContext.tsx` (Line 148-177)
```tsx
register() →
  1. createUserWithEmailAndPassword(auth, email, password) // Firebase
  2. getIdToken() // Get Firebase token
  3. authService.registerOrLogin({ idToken, fullName })
```

**API Service**: `auth.ts` (Line 10-32)
```tsx
registerOrLogin({ idToken, fullName }) →
  POST /api/auth/register
  Body: { idToken, fullName }
```

**Backend**: `authController.js` (Line 7-65)
```javascript
registerOrLogin() →
  1. Verify Firebase token
  2. Extract { uid, email } from token
  3. Check if user exists
  4. If new: Create User document in MongoDB
  5. Return user object
```

**MongoDB**: `users` collection
- Stores: firebaseUid, email, fullName, role: 'user'

---

#### 2. Pet Creation Flow
**Frontend**: `PetRecords.tsx` (Line 85-110)
```tsx
Form Fields:
- name, species, breed, age, weight, gender, color, medicalHistory, allergies

handleSubmit() →
  petsService.createPet(petData)
```

**API Service**: `pets.ts`
```tsx
createPet(data) →
  POST /api/pets
  Body: { name, species, breed, age, weight, gender, color, medicalHistory, allergies }
```

**Backend**: `petController.js`
```javascript
createPet() →
  1. Get user from req.user (auth middleware)
  2. Create Pet document
  3. Add pet ID to user.pets array
  4. Save both documents
  5. Return pet object
```

**MongoDB**: `pets` collection
- Stores: owner (userId), name, species, breed, age, weight, gender, color, medicalHistory, allergies

---

#### 3. Appointment Booking Flow
**Frontend**: `BookAppointment.tsx` (Line 74-107)
```tsx
Form Fields:
- petId, appointmentDate, appointmentTime, reason, notes

handleSubmit() →
  appointmentsService.createAppointment({
    vet: vetId,
    pet: petId,
    dateTime: `${appointmentDate}T${appointmentTime}`,
    reason,
    symptoms: notes
  })
```

**API Service**: `appointments.ts`
```tsx
createAppointment(data) →
  POST /api/appointments
  Body: { vet, pet, dateTime, reason, symptoms, notes }
```

**Backend**: `appointmentController.js`
```javascript
createAppointment() →
  1. Get user from req.user
  2. Validate vet and pet exist
  3. Check vet availability
  4. Create Appointment document
  5. Return appointment object
```

**MongoDB**: `appointments` collection
- Stores: user, vet, pet, dateTime, status: 'pending', reason, symptoms, notes

---

#### 4. Symptom Checker Flow ⚠️ (NEEDS DATABASE STORAGE)
**Frontend**: `App.tsx` (SymptomChecker component, Line 41-62)
```tsx
Form Fields:
- symptoms (text), file (optional image)

onSubmit() →
  symptomService.checkSymptoms({ symptoms, image })
```

**API Service**: `symptoms.ts` (EXISTS)
```tsx
checkSymptoms({ symptoms, image }) →
  POST /api/symptoms/check
  Body: FormData with symptoms and optional image
```

**Backend**: `symptomController.js` (EXISTS)
```javascript
checkSymptoms() →
  1. Get user from req.user
  2. Process image if uploaded
  3. Call Gemini AI API
  4. Format AI response
  5. ⚠️ MISSING: Save to SymptomChecks collection
  6. Return AI analysis
```

**MongoDB**: ⚠️ **MISSING `symptomchecks` collection**
- Should store: user, pet (if selected), symptoms, imageUrl, aiResponse, createdAt

---

#### 5. Vet Review Flow ⚠️ (NEEDS IMPLEMENTATION)
**Frontend**: Currently no review form exists
**Status**: ❌ NOT IMPLEMENTED

**Needed**:
- Add review form to `Vets.tsx` or vet detail page
- Create `ReviewForm.tsx` component
- Add review service
- Backend endpoint
- Reviews collection

---

#### 6. Vaccination Tracking ⚠️ (NEEDS IMPLEMENTATION)
**Frontend**: Vaccination data embedded in Pet form but not separately managed
**Status**: ⚠️ PARTIALLY IMPLEMENTED (in Pet model only)

**Needed**:
- Separate vaccination management UI
- Vaccination reminders
- Separate collection for better tracking
- Email/notification system for due vaccines

---

## 🔧 Implementation Priority

### HIGH PRIORITY (Core Functionality)
1. ✅ User Registration - WORKING
2. ✅ Pet Management - WORKING
3. ✅ Appointment Booking - WORKING
4. ⚠️ Symptom Checker Storage - NEEDS DB SAVE
5. ❌ Notifications - NOT IMPLEMENTED

### MEDIUM PRIORITY (Enhanced Features)
6. ❌ Reviews System - NOT IMPLEMENTED
7. ⚠️ Vaccination Tracking - NEEDS SEPARATION
8. ❌ Prescriptions - NOT IMPLEMENTED
9. ❌ Activity Logs (Admin) - NOT IMPLEMENTED

### LOW PRIORITY (Future Features)
10. ❌ Payments - NOT IMPLEMENTED
11. ❌ Real-time Chat - NOT IMPLEMENTED

---

## 📝 Next Steps

### Phase 1: Fix Existing Flows
1. ✅ Fix user registration (IN PROGRESS)
2. Add symptom check history saving
3. Implement basic notifications

### Phase 2: Create Missing Collections
4. Create SymptomChecks model
5. Create Reviews model
6. Create Notifications model

### Phase 3: Build New Features
7. Add review submission UI
8. Add vaccination reminder system
9. Add prescription tracking

### Phase 4: Admin Tools
10. Activity logging
11. Analytics dashboard
12. User management

---

## 🎯 Summary of Required Actions

### Backend Tasks:
1. Create 4 new Mongoose models (SymptomChecks, Reviews, Notifications, Vaccinations)
2. Add controllers for new models
3. Add routes for new endpoints
4. Update existing controllers to save related data

### Frontend Tasks:
1. Add symptom check history page
2. Create review submission form
3. Add notification system
4. Create vaccination tracking UI
5. Add error handling to all forms

### Integration Tasks:
1. Connect all forms to backend APIs
2. Add loading states
3. Add success/error messages
4. Test end-to-end data flow

---

**Last Updated**: October 6, 2025
**Status**: Documentation Complete - Ready for Implementation
