const mongoose = require('mongoose');

const fileAttachmentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  fileUrl: {
    type: String,
    required: true,
    trim: true,
  },
  fileType: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const vaccinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  nextDueDate: {
    type: Date,
  },
  administeredBy: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const vaccineCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    trim: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  issuingAuthority: {
    type: String,
    trim: true,
  },
  cardImageUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  attachments: [fileAttachmentSchema],
});

const medicalReportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true,
    enum: ['Blood Test', 'X-Ray', 'Ultrasound', 'MRI', 'CT Scan', 'Biopsy', 'Other'],
    trim: true,
  },
  reportDate: {
    type: Date,
    required: true,
  },
  veterinarian: {
    type: String,
    required: true,
    trim: true,
  },
  diagnosis: {
    type: String,
    trim: true,
  },
  findings: {
    type: String,
    trim: true,
  },
  recommendations: {
    type: String,
    trim: true,
  },
  reportFileUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const surgerySchema = new mongoose.Schema({
  surgeryType: {
    type: String,
    required: true,
    trim: true,
  },
  surgeryDate: {
    type: Date,
    required: true,
  },
  surgeon: {
    type: String,
    required: true,
    trim: true,
  },
  clinic: {
    type: String,
    trim: true,
  },
  anesthesia: {
    type: String,
    trim: true,
  },
  complications: {
    type: String,
    trim: true,
  },
  recoveryInstructions: {
    type: String,
    trim: true,
  },
  followUpDate: {
    type: Date,
  },
  surgeryReportUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const prescriptionSchema = new mongoose.Schema({
  medicationName: {
    type: String,
    required: true,
    trim: true,
  },
  prescriptionDate: {
    type: Date,
    required: true,
  },
  prescribingVet: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  quantity: {
    type: String,
    trim: true,
  },
  refillsRemaining: {
    type: Number,
    default: 0,
  },
  instructions: {
    type: String,
    trim: true,
  },
  prescriptionFileUrl: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Discontinued'],
    default: 'Active',
  },
  notes: {
    type: String,
    trim: true,
  },
});

const medicalRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  condition: {
    type: String,
    required: true,
    trim: true,
  },
  diagnosis: {
    type: String,
    trim: true,
  },
  treatment: {
    type: String,
    trim: true,
  },
  veterinarian: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],
  attachments: [fileAttachmentSchema],
});

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      minlength: [2, 'Pet name must be at least 2 characters long'],
      maxlength: [50, 'Pet name cannot exceed 50 characters'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Fish', 'Reptile', 'Other'],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true,
      maxlength: [100, 'Breed name cannot exceed 100 characters'],
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [50, 'Age seems unrealistic'],
    },
    ageUnit: {
      type: String,
      enum: ['years', 'months', 'weeks'],
      default: 'years',
    },
    dateOfBirth: {
      type: Date,
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    color: {
      type: String,
      trim: true,
      maxlength: [50, 'Color description cannot exceed 50 characters'],
    },
    microchipId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    medicalHistory: [medicalRecordSchema],
    vaccinations: [vaccinationSchema],
    vaccineCards: [vaccineCardSchema],
    medicalReports: [medicalReportSchema],
    surgeries: [surgerySchema],
    prescriptions: [prescriptionSchema],
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    medications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        dosage: {
          type: String,
          trim: true,
        },
        frequency: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        notes: {
          type: String,
          trim: true,
        },
      },
    ],
    specialNeeds: {
      type: String,
      trim: true,
      maxlength: [500, 'Special needs description cannot exceed 500 characters'],
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
petSchema.index({ owner: 1, isActive: 1 });
petSchema.index({ species: 1 });
petSchema.index({ createdAt: -1 });

// Virtual for age calculation from date of birth
petSchema.virtual('calculatedAge').get(function () {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }
  
  return years;
});

// Method to check if vaccinations are up to date
petSchema.methods.getUpcomingVaccinations = function () {
  const today = new Date();
  const upcoming = this.vaccinations.filter((vac) => {
    return vac.nextDueDate && vac.nextDueDate > today;
  });
  return upcoming.sort((a, b) => a.nextDueDate - b.nextDueDate);
};

// Method to check overdue vaccinations
petSchema.methods.getOverdueVaccinations = function () {
  const today = new Date();
  const overdue = this.vaccinations.filter((vac) => {
    return vac.nextDueDate && vac.nextDueDate < today;
  });
  return overdue.sort((a, b) => a.nextDueDate - b.nextDueDate);
};

// Method to add medical record
petSchema.methods.addMedicalRecord = function (record) {
  this.medicalHistory.push(record);
  return this.save();
};

// Method to add vaccination
petSchema.methods.addVaccination = function (vaccination) {
  this.vaccinations.push(vaccination);
  return this.save();
};

// Method to get safe pet object (for API responses)
petSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    species: this.species,
    breed: this.breed,
    age: this.age,
    ageUnit: this.ageUnit,
    dateOfBirth: this.dateOfBirth,
    weight: this.weight,
    weightUnit: this.weightUnit,
    gender: this.gender,
    color: this.color,
    microchipId: this.microchipId,
    medicalHistory: this.medicalHistory,
    vaccinations: this.vaccinations,
    vaccineCards: this.vaccineCards,
    medicalReports: this.medicalReports,
    surgeries: this.surgeries,
    prescriptions: this.prescriptions,
    allergies: this.allergies,
    medications: this.medications,
    specialNeeds: this.specialNeeds,
    photoUrl: this.photoUrl,
    medicalRecordCount: this.medicalHistory.length,
    vaccinationCount: this.vaccinations.length,
    vaccineCardCount: this.vaccineCards.length,
    medicalReportCount: this.medicalReports.length,
    surgeryCount: this.surgeries.length,
    prescriptionCount: this.prescriptions.length,
    upcomingVaccinations: this.getUpcomingVaccinations(),
    overdueVaccinations: this.getOverdueVaccinations(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find pets by owner
petSchema.statics.findByOwner = function (ownerId) {
  return this.find({ owner: ownerId, isActive: true }).sort({ createdAt: -1 });
};

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
