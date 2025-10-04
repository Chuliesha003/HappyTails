const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vet',
      required: [true, 'Veterinarian is required'],
      index: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet is required'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Appointment date and time is required'],
      index: true,
    },
    duration: {
      type: Number,
      default: 30, // Duration in minutes
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    symptoms: {
      type: String,
      trim: true,
      maxlength: [1000, 'Symptoms description cannot exceed 1000 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    vetNotes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Vet notes cannot exceed 2000 characters'],
    },
    diagnosis: {
      type: String,
      trim: true,
      maxlength: [1000, 'Diagnosis cannot exceed 1000 characters'],
    },
    prescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Prescription cannot exceed 1000 characters'],
    },
    fee: {
      type: Number,
      min: [0, 'Fee cannot be negative'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online', 'insurance', null],
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters'],
    },
    cancelledBy: {
      type: String,
      enum: ['user', 'vet', 'admin', null],
      default: null,
    },
    cancelledAt: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
appointmentSchema.index({ user: 1, dateTime: -1 });
appointmentSchema.index({ vet: 1, dateTime: 1 });
appointmentSchema.index({ status: 1, dateTime: 1 });
appointmentSchema.index({ dateTime: 1, status: 1 });

// Virtual for appointment end time
appointmentSchema.virtual('endTime').get(function () {
  if (!this.dateTime || !this.duration) return null;
  return new Date(this.dateTime.getTime() + this.duration * 60000);
});

// Method to check if appointment is in the past
appointmentSchema.methods.isPast = function () {
  return this.dateTime < new Date();
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function () {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  
  // Allow cancellation up to 2 hours before appointment
  const twoHoursBefore = new Date(this.dateTime.getTime() - 2 * 60 * 60 * 1000);
  return new Date() < twoHoursBefore;
};

// Method to cancel appointment
appointmentSchema.methods.cancel = function (cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancelledBy = cancelledBy;
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return this.save();
};

// Method to confirm appointment
appointmentSchema.methods.confirm = function () {
  this.status = 'confirmed';
  return this.save();
};

// Method to complete appointment
appointmentSchema.methods.complete = function (vetNotes, diagnosis, prescription) {
  this.status = 'completed';
  if (vetNotes) this.vetNotes = vetNotes;
  if (diagnosis) this.diagnosis = diagnosis;
  if (prescription) this.prescription = prescription;
  return this.save();
};

// Method to get safe appointment object
appointmentSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    user: this.user,
    vet: this.vet,
    pet: this.pet,
    dateTime: this.dateTime,
    duration: this.duration,
    endTime: this.endTime,
    status: this.status,
    reason: this.reason,
    symptoms: this.symptoms,
    notes: this.notes,
    fee: this.fee,
    isPaid: this.isPaid,
    paymentMethod: this.paymentMethod,
    cancellationReason: this.cancellationReason,
    cancelledBy: this.cancelledBy,
    cancelledAt: this.cancelledAt,
    followUpRequired: this.followUpRequired,
    followUpDate: this.followUpDate,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find appointments by user
appointmentSchema.statics.findByUser = function (userId, options = {}) {
  const query = { user: userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.upcoming) {
    query.dateTime = { $gte: new Date() };
    query.status = { $in: ['pending', 'confirmed'] };
  }
  
  if (options.past) {
    query.dateTime = { $lt: new Date() };
  }
  
  return this.find(query)
    .populate('vet', 'name clinicName phoneNumber email')
    .populate('pet', 'name species breed')
    .sort({ dateTime: -1 });
};

// Static method to find appointments by vet
appointmentSchema.statics.findByVet = function (vetId, options = {}) {
  const query = { vet: vetId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.date) {
    const startOfDay = new Date(options.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(options.date);
    endOfDay.setHours(23, 59, 59, 999);
    query.dateTime = { $gte: startOfDay, $lte: endOfDay };
  }
  
  return this.find(query)
    .populate('user', 'fullName email phoneNumber')
    .populate('pet', 'name species breed age')
    .sort({ dateTime: 1 });
};

// Static method to check for time conflicts
appointmentSchema.statics.hasConflict = async function (vetId, dateTime, duration, excludeId = null) {
  const appointmentStart = new Date(dateTime);
  const appointmentEnd = new Date(dateTime.getTime() + duration * 60000);
  
  const query = {
    vet: vetId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      // New appointment starts during existing appointment
      {
        dateTime: { $lte: appointmentStart },
        $expr: {
          $gte: [
            { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
            appointmentStart,
          ],
        },
      },
      // New appointment ends during existing appointment
      {
        dateTime: { $gte: appointmentStart, $lt: appointmentEnd },
      },
    ],
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
