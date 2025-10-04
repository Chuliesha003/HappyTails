const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'vet', 'admin'],
      default: 'user',
    },
    pets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
      },
    ],
    guestUsageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    profileImage: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for pet count
userSchema.virtual('petCount').get(function () {
  return this.pets.length;
});

// Method to check if user has reached guest usage limit
userSchema.methods.hasReachedGuestLimit = function () {
  const GUEST_LIMIT = 3;
  return this.role === 'user' && this.guestUsageCount >= GUEST_LIMIT;
};

// Method to increment guest usage count
userSchema.methods.incrementGuestUsage = async function () {
  this.guestUsageCount += 1;
  return await this.save();
};

// Method to get safe user object (without sensitive data)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    firebaseUid: this.firebaseUid,
    email: this.email,
    fullName: this.fullName,
    role: this.role,
    petCount: this.pets.length,
    profileImage: this.profileImage,
    phoneNumber: this.phoneNumber,
    guestUsageCount: this.guestUsageCount,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find user by Firebase UID
userSchema.statics.findByFirebaseUid = function (firebaseUid) {
  return this.findOne({ firebaseUid });
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
