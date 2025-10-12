const Pet = require('../models/Pet');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads/documents');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'doc-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDFs and images
    const allowedTypes = /pdf|jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'));
    }
  }
});

/**
 * Get all pets for the authenticated user
 */
const getAllPets = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;

    // Find user by Firebase UID
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find all active pets for this user
    const pets = await Pet.findByOwner(user._id);

    res.status(200).json({
      success: true,
      count: pets.length,
      pets: pets.map((pet) => pet.toSafeObject()),
    });
  } catch (error) {
    console.error('Get all pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pets',
      error: error.message,
    });
  }
};

/**
 * Get a single pet by ID
 */
const getPetById = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pet and verify ownership
    const pet = await Pet.findOne({ _id: id, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission to view it',
      });
    }

    res.status(200).json({
      success: true,
      pet: {
        ...pet.toSafeObject(),
        medicalHistory: pet.medicalHistory,
        vaccinations: pet.vaccinations,
      },
    });
  } catch (error) {
    console.error('Get pet by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pet',
      error: error.message,
    });
  }
};

/**
 * Create a new pet
 */
const createPet = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
  const petData = req.body || {};

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Normalize inputs
    const name = (petData.name || '').trim();
    const species = (petData.species || '').trim();
    const breed = (petData.breed || '').trim();
    const gender = petData.gender || 'Unknown';
    const age = typeof petData.age === 'number' ? petData.age : Number(petData.age);
    const weight = typeof petData.weight === 'number' ? petData.weight : Number(petData.weight);
    const allergies = Array.isArray(petData.allergies)
      ? petData.allergies.map((a) => String(a).trim()).filter(Boolean)
      : [];

    if (!name || !species || !breed) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: ['name, species, and breed are required'] });
    }

    // Check duplicate active pet by name+species for this user
    const existing = await Pet.findOne({ owner: user._id, name, species, isActive: true });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A pet with the same name and species already exists.' });
    }

    // Create new pet
    const pet = new Pet({
      name,
      species,
      breed,
      gender,
      age,
      weight,
      color: (petData.color || '').trim() || undefined,
      allergies,
      owner: user._id,
    });

    await pet.save();

    // Add pet reference to user
    user.pets.push(pet._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      pet: pet.toSafeObject(),
    });
  } catch (error) {
    console.error('Create pet error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create pet',
      error: error.message,
    });
  }
};

/**
 * Update a pet
 */
const updatePet = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const updates = req.body;

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pet and verify ownership
    const pet = await Pet.findOne({ _id: id, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission to update it',
      });
    }

    // Prevent changing owner
    delete updates.owner;
    delete updates.isActive;

    // Update pet fields
    Object.keys(updates).forEach((key) => {
      pet[key] = updates[key];
    });

    await pet.save();

    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      pet: pet.toSafeObject(),
    });
  } catch (error) {
    console.error('Update pet error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update pet',
      error: error.message,
    });
  }
};

/**
 * Delete a pet (soft delete)
 */
const deletePet = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pet and verify ownership
    const pet = await Pet.findOne({ _id: id, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission to delete it',
      });
    }

    // Soft delete
    pet.isActive = false;
    await pet.save();

    // Remove pet reference from user
    user.pets = user.pets.filter((petId) => petId.toString() !== id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pet',
      error: error.message,
    });
  }
};

/**
 * Add medical record to a pet
 */
const addMedicalRecord = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const recordData = req.body;

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pet and verify ownership
    const pet = await Pet.findOne({ _id: id, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission to update it',
      });
    }

    // Add medical record
    await pet.addMedicalRecord(recordData);

    res.status(201).json({
      success: true,
      message: 'Medical record added successfully',
      medicalHistory: pet.medicalHistory,
    });
  } catch (error) {
    console.error('Add medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add medical record',
      error: error.message,
    });
  }
};

/**
 * Add vaccination to a pet
 */
const addVaccination = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const vaccinationData = req.body;

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pet and verify ownership
    const pet = await Pet.findOne({ _id: id, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission to update it',
      });
    }

    // Add vaccination
    await pet.addVaccination(vaccinationData);

    res.status(201).json({
      success: true,
      message: 'Vaccination added successfully',
      vaccinations: pet.vaccinations,
      upcomingVaccinations: pet.getUpcomingVaccinations(),
    });
  } catch (error) {
    console.error('Add vaccination error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add vaccination',
      error: error.message,
    });
  }
};

/**
 * Add document to a pet
 */
const addDocument = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const documentData = req.body;

    // Find user
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pet and verify ownership
    const pet = await Pet.findOne({ _id: id, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission to update it',
      });
    }

    // Add document
    await pet.addDocument(documentData);

    res.status(201).json({
      success: true,
      message: 'Document added successfully',
      documents: pet.documents,
    });
  } catch (error) {
    console.error('Add document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add document',
      error: error.message,
    });
  }
};

/**
 * Upload a document file
 */
const uploadDocument = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { uid: firebaseUid } = req.user;
      const { documentType } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      // Find user
      const user = await User.findByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Determine file type
      const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';

      // Create file path for serving
      const filePath = `/uploads/documents/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        filePath: filePath,
        fileName: req.file.originalname,
        fileType: fileType,
        documentType: documentType || 'other',
      });

    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload document',
        error: error.message,
      });
    }
  }
];

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  addMedicalRecord,
  addVaccination,
  addDocument,
  uploadDocument,
};
