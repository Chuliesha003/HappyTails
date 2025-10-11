const Vet = require('../models/Vet');
const User = require('../models/User');

/**
 * Search for nearby vets based on geolocation
 */
const searchNearbyVets = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.query;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const maxDistanceKm = maxDistance ? parseFloat(maxDistance) : 50;

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided',
      });
    }

    // Find nearby vets using geospatial query
    const vets = await Vet.findNearby(lng, lat, maxDistanceKm);

    res.status(200).json({
      success: true,
      count: vets.length,
      vets: vets.map((vet) => vet.toSafeObject()),
      location: {
        latitude: lat,
        longitude: lng,
        maxDistance: maxDistanceKm,
      },
    });
  } catch (error) {
    console.error('Search nearby vets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search nearby veterinarians',
      error: error.message,
    });
  }
};

/**
 * Get all vets with optional filters
 */
const getAllVets = async (req, res) => {
  try {
    const { city, specialization, search, sort = 'rating', page = 1, limit = 10 } = req.query;

    let query = { isActive: true, isVerified: true };
    let vets;

    // Search by text
    if (search) {
      vets = await Vet.searchVets(search);
    }
    // Filter by city
    else if (city) {
      vets = await Vet.findByCity(city);
    }
    // Filter by specialization
    else if (specialization) {
      vets = await Vet.findBySpecialization(specialization);
    }
    // Get all vets
    else {
      const sortOptions = {};
      if (sort === 'rating') sortOptions.rating = -1;
      if (sort === 'name') sortOptions.name = 1;
      if (sort === 'experience') sortOptions.yearsOfExperience = -1;
      if (sort === 'fee') sortOptions.consultationFee = 1;

      const skip = (page - 1) * limit;

      vets = await Vet.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Vet.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: vets.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        vets: vets.map((vet) => vet.toSafeObject()),
      });
    }

    res.status(200).json({
      success: true,
      count: vets.length,
      vets: vets.map((vet) => vet.toSafeObject()),
    });
  } catch (error) {
    console.error('Get all vets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch veterinarians',
      error: error.message,
    });
  }
};

/**
 * Get a single vet by ID
 */
const getVetById = async (req, res) => {
  try {
    const { id } = req.params;

    const vet = await Vet.findOne({ _id: id, isActive: true }).populate(
      'reviews.user',
      'fullName profileImage'
    );

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found',
      });
    }

    res.status(200).json({
      success: true,
      vet: vet.toSafeObject(true), // Include reviews
    });
  } catch (error) {
    console.error('Get vet by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch veterinarian',
      error: error.message,
    });
  }
};

/**
 * Create a new vet (admin only)
 */
const createVet = async (req, res) => {
  try {
    const vetData = req.body;

    // Check if vet with email or license already exists
    const existingVet = await Vet.findOne({
      $or: [{ email: vetData.email }, { licenseNumber: vetData.licenseNumber }],
    });

    if (existingVet) {
      return res.status(409).json({
        success: false,
        message: 'Veterinarian with this email or license number already exists',
      });
    }

    const vet = new Vet(vetData);
    await vet.save();

    res.status(201).json({
      success: true,
      message: 'Veterinarian created successfully',
      vet: vet.toSafeObject(),
    });
  } catch (error) {
    console.error('Create vet error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create veterinarian',
      error: error.message,
    });
  }
};

/**
 * Update a vet (admin only)
 */
const updateVet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent changing certain fields
    delete updates.reviews;
    delete updates.rating;
    delete updates.reviewCount;

    const vet = await Vet.findOne({ _id: id, isActive: true });

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found',
      });
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      vet[key] = updates[key];
    });

    await vet.save();

    res.status(200).json({
      success: true,
      message: 'Veterinarian updated successfully',
      vet: vet.toSafeObject(),
    });
  } catch (error) {
    console.error('Update vet error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update veterinarian',
      error: error.message,
    });
  }
};

/**
 * Delete a vet (admin only - soft delete)
 */
const deleteVet = async (req, res) => {
  try {
    const { id } = req.params;

    const vet = await Vet.findOne({ _id: id, isActive: true });

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found',
      });
    }

    // Soft delete
    vet.isActive = false;
    await vet.save();

    res.status(200).json({
      success: true,
      message: 'Veterinarian deleted successfully',
    });
  } catch (error) {
    console.error('Delete vet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete veterinarian',
      error: error.message,
    });
  }
};

/**
 * Add review to a vet
 */
const addReview = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
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

    // Find vet
    const vet = await Vet.findOne({ _id: id, isActive: true });

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found',
      });
    }

    // Check if user already reviewed
    const existingReview = vet.reviews.find(
      (review) => review.user.toString() === user._id.toString()
    );

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this veterinarian',
      });
    }

    // Add review
    await vet.addReview(user._id, rating, comment);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      rating: vet.rating,
      reviewCount: vet.reviewCount,
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message,
    });
  }
};

/**
 * Get vet specializations (for filter dropdown)
 */
const getSpecializations = async (req, res) => {
  try {
    const specializations = await Vet.distinct('specialization', {
      isActive: true,
      isVerified: true,
    });

    res.status(200).json({
      success: true,
      specializations: specializations.sort(),
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specializations',
      error: error.message,
    });
  }
};

/**
 * Get vet cities (for filter dropdown)
 */
const getCities = async (req, res) => {
  try {
    const cities = await Vet.distinct('location.city', {
      isActive: true,
      isVerified: true,
    });

    res.status(200).json({
      success: true,
      cities: cities.sort(),
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message,
    });
  }
};

module.exports = {
  getAllVets,
  searchNearbyVets,
  getVetById,
  createVet,
  updateVet,
  deleteVet,
  addReview,
  getSpecializations,
  getCities,
};
