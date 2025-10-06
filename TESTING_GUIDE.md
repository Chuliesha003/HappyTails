# 🧪 Quick Test Guide - New Features

## ✅ What's New and Ready to Test

### 1. Symptom Checker Now Saves History ✅

**What Changed:**
- Before: Symptom checker only returned AI analysis
- Now: Every symptom check is saved to MongoDB `symptomchecks` collection

**How to Test:**
1. Go to Symptom Checker page
2. Enter pet symptoms (e.g., "vomiting and lethargy")
3. Submit the form
4. Check the response - you'll now get a `symptomCheckId`
5. **Verify in MongoDB:** Go to Atlas → happytails database → symptomchecks collection
6. You should see your symptom check record with:
   - User ID
   - Pet ID (if you selected one)
   - Symptoms text
   - AI response (conditions, urgency, recommendations)
   - Timestamp

**API Endpoint:**
```
POST http://localhost:5000/api/symptom-checker/check
Headers: 
  Authorization: Bearer <your-firebase-token>
Body:
{
  "petType": "dog",
  "symptoms": "Vomiting and lethargy for 2 days",
  "duration": "2 days",
  "severity": "moderate",
  "petId": "your-pet-id-here"
}
```

---

### 2. Notifications System (Backend Ready) ✅

**What's Available:**
- Get unread notification count (for badge)
- Get all user notifications (with pagination)
- Mark notification as read
- Mark all notifications as read
- Delete notification
- Create test notifications

**How to Test:**

#### Create a Test Notification:
```bash
POST http://localhost:5000/api/notifications/test
Headers: 
  Authorization: Bearer <your-firebase-token>
Body:
{
  "title": "Welcome to HappyTails!",
  "message": "Your account has been successfully created",
  "type": "general",
  "priority": "medium"
}
```

#### Get Unread Count:
```bash
GET http://localhost:5000/api/notifications/unread-count
Headers: 
  Authorization: Bearer <your-firebase-token>
```

#### Get All Notifications:
```bash
GET http://localhost:5000/api/notifications?page=1&limit=20
Headers: 
  Authorization: Bearer <your-firebase-token>
```

#### Mark as Read:
```bash
PUT http://localhost:5000/api/notifications/<notification-id>/read
Headers: 
  Authorization: Bearer <your-firebase-token>
```

**Frontend TODO:**
- [ ] Create `NotificationBell.tsx` component in header
- [ ] Show unread count badge
- [ ] Display notification dropdown
- [ ] Handle click to navigate

---

### 3. Review System (Backend Ready) ✅

**What's Available:**
- Submit vet reviews
- Get vet reviews with rating statistics
- Update/delete your reviews
- Vote on reviews (helpful/not helpful)
- Vets can respond to reviews
- Automatic rating calculation for vets

**How to Test:**

#### Submit a Review:
```bash
POST http://localhost:5000/api/reviews
Headers: 
  Authorization: Bearer <your-firebase-token>
Body:
{
  "vetId": "your-vet-id",
  "appointmentId": "your-completed-appointment-id",
  "rating": 5,
  "comment": "Dr. Smith was fantastic! Very thorough and caring.",
  "detailedRatings": {
    "professionalism": 5,
    "communication": 5,
    "facility": 4,
    "value": 5
  },
  "tags": ["friendly", "knowledgeable", "clean-facility"]
}
```

**Note:** You must have a completed appointment with the vet to submit a review.

#### Get Vet's Reviews (Public - No Auth Required):
```bash
GET http://localhost:5000/api/reviews/vet/<vet-id>?page=1&limit=10&sort=recent
```

Response includes:
- List of reviews
- Average rating
- Total review count
- Rating distribution (how many 5-star, 4-star, etc.)

#### Get Your Reviews:
```bash
GET http://localhost:5000/api/reviews/my-reviews
Headers: 
  Authorization: Bearer <your-firebase-token>
```

#### Update Your Review:
```bash
PUT http://localhost:5000/api/reviews/<review-id>
Headers: 
  Authorization: Bearer <your-firebase-token>
Body:
{
  "rating": 4,
  "comment": "Updated my review after follow-up visit"
}
```

#### Vote on a Review:
```bash
POST http://localhost:5000/api/reviews/<review-id>/vote
Headers: 
  Authorization: Bearer <your-firebase-token>
Body:
{
  "voteType": "helpful"
}
```

#### Vet Responds to Review (Vets Only):
```bash
POST http://localhost:5000/api/reviews/<review-id>/respond
Headers: 
  Authorization: Bearer <your-firebase-token-as-vet>
Body:
{
  "responseText": "Thank you for your kind words! We're glad we could help."
}
```

**Frontend TODO:**
- [ ] Create `ReviewForm.tsx` component
- [ ] Add star rating input
- [ ] Display reviews on vet detail pages
- [ ] Show average rating with stars
- [ ] Allow helpful/not helpful voting

---

### 4. Appointment Booking Creates Notification ✅

**What Changed:**
- Before: Only created appointment in database
- Now: Also creates a notification reminder 24 hours before appointment

**How to Test:**
1. Book an appointment through the UI (BookAppointment.tsx)
2. Check MongoDB `appointments` collection - appointment saved ✅
3. Check MongoDB `notifications` collection - notification created ✅
4. The notification will have:
   - Type: "appointment"
   - Title: "Upcoming Appointment Reminder"
   - Link to appointment details
   - Scheduled to show 24 hours before appointment

**Verify:**
```bash
# After booking appointment, check notifications
GET http://localhost:5000/api/notifications
Headers: 
  Authorization: Bearer <your-firebase-token>
```

You should see a notification about your upcoming appointment.

---

## 🗄️ MongoDB Collections to Check

After testing, verify data in MongoDB Atlas:

1. **symptomchecks** - Should have your symptom analysis records
   - Fields: user, pet, symptoms, aiResponse, urgencyLevel, createdAt

2. **notifications** - Should have test notifications and appointment reminders
   - Fields: user, type, title, message, isRead, priority, createdAt

3. **reviews** - Should have vet reviews (if you created any)
   - Fields: vet, user, rating, comment, helpful, createdAt

4. **activitylogs** - (Optional) Will be populated when admin features are used
   - Fields: user, action, targetModel, metadata, createdAt

---

## 🐛 Troubleshooting

### Symptom Check Not Saving?
- Check browser console for errors
- Verify Firebase token is valid
- Check backend logs: `cd backend && npm start`
- Verify MongoDB connection in backend logs

### Notification Not Created?
- Check if user is authenticated
- Verify appointment was created successfully
- Check backend logs for notification creation errors
- Non-critical: Appointment still works even if notification fails

### Review Submission Fails?
- **"Already reviewed this vet"** - You can only submit one review per vet
- **"Appointment not found"** - Verify appointment ID is correct
- **"Appointment not completed"** - Only completed appointments can be reviewed
- **Rating validation** - Rating must be between 1 and 5

### Can't See Notifications?
- Frontend UI not built yet - use API endpoints to test
- Check MongoDB `notifications` collection directly
- Use Postman or curl to test endpoints

---

## 📊 Testing Checklist

### Symptom Checker:
- [ ] Submit symptom check (logged in)
- [ ] Check MongoDB `symptomchecks` collection
- [ ] Verify user ID matches your account
- [ ] Verify AI response is saved
- [ ] Submit as guest (check `guestSession` field)

### Notifications:
- [ ] Create test notification via API
- [ ] Get unread count via API
- [ ] Get all notifications via API
- [ ] Mark notification as read via API
- [ ] Verify `isRead` changes in MongoDB
- [ ] Book appointment and check for auto-created notification

### Reviews:
- [ ] Create a completed appointment
- [ ] Submit review for that appointment
- [ ] Check MongoDB `reviews` collection
- [ ] Get vet's reviews via API (verify rating stats)
- [ ] Try to submit duplicate review (should fail)
- [ ] Update your review
- [ ] Vote on someone else's review
- [ ] Check vet's average rating updated

### End-to-End:
- [ ] Register new user → Check `users` collection
- [ ] Add pet → Check `pets` collection
- [ ] Book appointment → Check `appointments` + `notifications` collections
- [ ] Submit symptom check → Check `symptomchecks` collection
- [ ] Submit review → Check `reviews` collection + vet's rating

---

## 🎉 Success Indicators

**You'll know everything is working when:**

✅ Symptom checks appear in MongoDB with full AI response  
✅ Notifications are created automatically when booking appointments  
✅ Unread count API returns correct number  
✅ Reviews are saved with automatic vet rating calculation  
✅ All collections visible in MongoDB Atlas  
✅ No errors in backend console logs  
✅ All API endpoints return 200/201 status codes  

---

## 🚀 Next Steps

Once backend testing is complete:

1. **Build Notification UI:**
   - Create `NotificationBell.tsx` component
   - Add to app header
   - Connect to notification APIs
   - Show unread count badge

2. **Build Review Form:**
   - Create `ReviewForm.tsx` component
   - Add star rating input
   - Add to vet detail pages
   - Display existing reviews

3. **Build Symptom History:**
   - Create `SymptomHistory.tsx` page
   - List all past symptom checks
   - Show AI analysis results
   - Link to related appointments

---

**Need Help?**
- Check `DATABASE_SCHEMA_AND_DATA_FLOW.md` for detailed schema info
- Check `PROJECT_COMPLETION_SUMMARY.md` for full overview
- All endpoints have error messages to help debug
- Backend logs show detailed information about each request
