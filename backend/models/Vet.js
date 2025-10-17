const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'],
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Review comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const vetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veterinarian name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    clinicName: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
      maxlength: [200, 'Clinic name cannot exceed 200 characters'],
    },
    specialization: {
      type: [String],
      required: [true, 'At least one specialization is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one specialization is required',
      },
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [70, 'Years of experience seems unrealistic'],
    },
    qualifications: [
      {
        degree: {
          type: String,
          trim: true,
        },
        institution: {
          type: String,
          trim: true,
        },
        year: {
          type: Number,
        },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: 'Sri Lanka',
        trim: true,
      },
    },
    availability: [availabilitySchema],
    consultationFee: {
      type: Number,
      min: [0, 'Consultation fee cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [reviewSchema],
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    profileImage: {
      type: String,
      trim: true,
    },
    services: [
      {
        type: String,
        trim: true,
      },
    ],
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
vetSchema.index({ email: 1 });
vetSchema.index({ 'location.city': 1 });
vetSchema.index({ specialization: 1 });
vetSchema.index({ rating: -1 });
vetSchema.index({ isActive: 1, isVerified: 1 });
// Geospatial index for nearby search
vetSchema.index({ 'location.coordinates': '2dsphere' });

// Text index for search functionality
vetSchema.index({
  name: 'text',
  clinicName: 'text',
  'location.city': 'text',
  specialization: 'text',
});

// Virtual for average rating calculation
vetSchema.virtual('averageRating').get(function () {
  if (this.reviewCount === 0) return 0;
  return this.rating;
});

// Method to add review and update rating
vetSchema.methods.addReview = async function (userId, rating, comment) {
  // Add review
  this.reviews.push({
    user: userId,
    rating,
    comment,
  });

  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
  this.reviewCount = this.reviews.length;

  return await this.save();
};

// Method to check if available on specific day and time
vetSchema.methods.isAvailableAt = function (day, time) {
  const daySchedule = this.availability.find(
    (slot) => slot.day === day && slot.isAvailable
  );

  if (!daySchedule) return false;

  // Simple time comparison (format: HH:MM)
  return time >= daySchedule.startTime && time <= daySchedule.endTime;
};

// Method to get safe vet object (for public API responses)
vetSchema.methods.toSafeObject = function (includeReviews = false) {
  const obj = {
    id: this._id,
    name: this.name,
    email: this.email,
    phoneNumber: this.phoneNumber,
    clinicName: this.clinicName,
    specialization: this.specialization,
    yearsOfExperience: this.yearsOfExperience,
    qualifications: this.qualifications,
    location: this.location,
    availability: this.availability,
    consultationFee: this.consultationFee,
    rating: this.rating,
    reviewCount: this.reviewCount,
    bio: this.bio,
    profileImage: this.profileImage,
    services: this.services,
    languages: this.languages,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };

  if (includeReviews) {
    obj.reviews = this.reviews;
  }

  return obj;
};

// Static method to search vets
vetSchema.statics.searchVets = function (query) {
  return this.find(
    { $text: { $search: query }, isActive: true, isVerified: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Static method to find vets by city
vetSchema.statics.findByCity = function (city) {
  return this.find({
    'location.city': new RegExp(city, 'i'),
    isActive: true,
    isVerified: true,
  }).sort({ rating: -1 });
};

// Static method to find vets by specialization
vetSchema.statics.findBySpecialization = function (specialization) {
  return this.find({
    specialization: { $in: [new RegExp(specialization, 'i')] },
    isActive: true,
    isVerified: true,
  }).sort({ rating: -1 });
};

// Static method to find nearby vets using geospatial query
vetSchema.statics.findNearby = function (longitude, latitude, maxDistanceKm = 50) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceKm * 1000, // Convert km to meters
      },
    },
    isActive: true,
    isVerified: true,
  }).limit(50); // Limit to 50 results
};

const Vet = mongoose.model('Vet', vetSchema);

module.exports = Vet;
