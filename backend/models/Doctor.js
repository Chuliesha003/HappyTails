const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    credentials: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    practice: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
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

// generate slug on save if not provided
doctorSchema.pre('save', function (next) {
  if (!this.slug && this.fullName) {
    this.slug = this.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
