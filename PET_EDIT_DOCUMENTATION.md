# Pet Edit Functionality Documentation

## Overview
The pet edit feature allows users to update their pet's information through the UI. All changes are saved to the MongoDB database in real-time.

## How It Works

### Frontend Flow

1. **Click Edit Button**
   - User clicks the edit pencil icon or "Edit" button on a pet card
   - Triggers `handleEditPet(pet)` function in `PetRecords.tsx`

2. **Form Population**
   - The form is populated with the pet's current data
   - `editingPetId` state is set to track which pet is being edited
   - The "Add Pet" section title changes to "Update your pet's information"

3. **User Makes Changes**
   - User modifies any pet fields (name, breed, age, weight, etc.)
   - Form validation occurs on submit

4. **Submit Update**
   - User clicks "Update Pet" button
   - Frontend calls `petsService.updatePet(petId, updatedData)`
   - API request: `PUT /api/pets/{id}` with updated fields

5. **Response Handling**
   - On success: Pet list is updated with new data
   - Success toast notification shown
   - Form is reset and editing mode is cleared
   - On error: Error toast is shown with details

### Backend Flow

1. **Authentication**
   - Request is authenticated via JWT token
   - User's Firebase UID is extracted from token

2. **Authorization Check**
   - Backend finds the user by Firebase UID
   - Verifies pet exists and belongs to the user
   - Returns 404 if pet not found or user doesn't own it

3. **Data Validation**
   - Mongoose schema validation ensures data integrity
   - Required fields must be present
   - Data types are checked (age = number, etc.)

4. **Update Database**
   - Pet document is updated with new values
   - Changes are saved to MongoDB
   - `toSafeObject()` returns sanitized pet data

5. **Response**
   - Returns `{ success: true, pet: updatedPet }`
   - HTTP 200 status code on success

## Code Files Involved

### Frontend
- **`frontend/src/pages/PetRecords.tsx`**
  - `handleEditPet()` - Populates form with pet data
  - `handleSubmit()` - Handles form submission (create or update)
  - `editingPetId` state - Tracks which pet is being edited
  
- **`frontend/src/services/pets.ts`**
  - `updatePet(id, data)` - API service call
  - Makes PUT request to `/api/pets/{id}`

- **`frontend/src/lib/api.ts`**
  - Generic `put()` method
  - Error handling wrapper

### Backend
- **`backend/routes/petRoutes.js`**
  - `PUT /api/pets/:id` route definition
  - Auth middleware applied

- **`backend/controllers/petController.js`**
  - `updatePet()` controller function
  - Ownership verification
  - Data validation
  - Database update logic

- **`backend/models/Pet.js`**
  - Mongoose schema definition
  - `toSafeObject()` method for response sanitization

## Data Flow Example

```
┌─────────────┐
│   Browser   │
│             │
│ Click Edit  │──┐
└─────────────┘  │
                 │
                 ├──> handleEditPet(pet)
                 │
                 ├──> Form populated with pet data
                 │    editingPetId = pet.id
                 │
                 ├──> User edits fields
                 │
                 ├──> Click "Update Pet"
                 │
                 ├──> handleSubmit()
                 │
                 ├──> petsService.updatePet(id, data)
                 │
                 ├──> PUT /api/pets/{id}
                 │    Headers: { Authorization: "Bearer TOKEN" }
                 │    Body: { name, age, weight, ... }
                 │
┌────────────────▼────┐
│  Backend Server     │
│                     │
│  Auth Middleware    │──> Verify JWT token
│                     │
│  petController      │──> Find user by Firebase UID
│  .updatePet()       │──> Find pet & verify ownership
│                     │──> Update pet fields
│                     │──> Save to MongoDB
│                     │
│  Response           │
│  { pet: {...} }     │
└────────────────┬────┘
                 │
                 ├──> Frontend receives response
                 │
                 ├──> Update pets array in state
                 │
                 ├──> Show success toast
                 │
                 ├──> Reset form & clear editingPetId
                 │
┌────────────────▼────┐
│   UI Updates        │
│   Pet card shows    │
│   new information   │
└─────────────────────┘
```

## Database Changes

When a pet is updated, the changes are immediately persisted to MongoDB:

```javascript
// Before update
{
  _id: "673101ac...",
  owner: "670f95f2...",
  name: "Broovi",
  breed: "Shitzu",
  age: 1,
  weight: 1,
  color: "Black"
}

// After update (example: changed age and weight)
{
  _id: "673101ac...",
  owner: "670f95f2...",
  name: "Broovi",
  breed: "Shitzu",
  age: 2,          // ← Updated
  weight: 1.5,     // ← Updated
  color: "Black"
}
```

## Security Features

1. **Authentication Required**
   - Only logged-in users can update pets
   - JWT token must be valid

2. **Authorization Check**
   - Users can only update their own pets
   - Backend verifies `pet.owner === user._id`

3. **Input Validation**
   - Mongoose schema validation
   - Required fields enforced
   - Data type checking

4. **Protected Fields**
   - Cannot change `owner` field
   - Cannot change `isActive` status via this endpoint

## Testing the Feature

### Manual Testing

1. Log in to the application
2. Navigate to "Pet Records" page
3. Click the edit button (pencil icon) on any pet card
4. Modify some fields (e.g., age, weight, color)
5. Click "Update Pet"
6. Verify success message appears
7. Refresh page to confirm changes persisted
8. Check MongoDB to verify database was updated

### API Testing

Use the provided test script:

```bash
cd backend
node test-update-pet.js
```

Or use curl:

```bash
curl -X PUT http://localhost:5000/api/pets/{PET_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "age": 3,
    "weight": 5.5
  }'
```

## Troubleshooting

### Issue: "Pet not found" error
- **Cause**: Pet ID doesn't exist or user doesn't own the pet
- **Solution**: Verify pet ID and ensure user is logged in

### Issue: "Validation error"
- **Cause**: Required fields missing or invalid data types
- **Solution**: Check all required fields are provided with correct types

### Issue: Changes don't appear after update
- **Cause**: State not updating or page not refreshing
- **Solution**: Check browser console for errors, verify API response

### Issue: 401 Unauthorized
- **Cause**: Not logged in or token expired
- **Solution**: Log in again to get fresh token

## Current Status

✅ **Working Features:**
- Edit button displays correctly on pet cards
- Form populates with existing pet data when edit is clicked
- Update API endpoint is fully functional
- Database updates persist correctly
- Error handling and validation in place
- Success/error toast notifications

✅ **Database Integration:**
- All updates are saved to MongoDB in real-time
- Changes persist across page refreshes
- Data integrity is maintained

🔧 **To Test:**
1. Visit http://localhost:8080/pet-records
2. Click edit on your pet (Broovi)
3. Change some values (e.g., age from 1 to 2)
4. Click "Update Pet"
5. See success message
6. Refresh page - changes should persist!
