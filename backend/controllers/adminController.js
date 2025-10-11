const User = require('../models/User');
const Pet = require('../models/Pet');
const Vet = require('../models/Vet');
const Appointment = require('../models/Appointment');
const Article = require('../models/Article');

// Get system statistics
exports.getStats = async (req, res) => {
  try {
    // Get counts for all entities
    const [
      totalUsers,
      totalPets,
      totalVets,
      totalAppointments,
      totalArticles,
      activeUsers,
      pendingAppointments,
      publishedArticles,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Pet.countDocuments(),
      Vet.countDocuments({ isActive: true }),
      Appointment.countDocuments(),
      Article.countDocuments(),
      User.countDocuments({ isActive: true, updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Appointment.countDocuments({ status: 'pending' }),
      Article.countDocuments({ isPublished: true }),
    ]);

    // Get user role breakdown
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    // Get appointment status breakdown
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get articles by category
    const articlesByCategory = await Article.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Get recent registrations (last 7 days)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Get recent appointments (last 7 days)
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPets,
        totalVets,
        totalAppointments,
        totalArticles,
        activeUsers,
        pendingAppointments,
        publishedArticles,
        recentUsers,
        recentAppointments,
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        appointmentsByStatus: appointmentsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        articlesByCategory: articlesByCategory.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

// Get all users with pagination and filters
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search, sort = '-createdAt' } = req.query;

    const query = {};

    // Apply filters
    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-firebaseUid')
      .populate('pets', 'name species')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users: users,
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get single user details
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-firebaseUid')
      .populate('pets');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's appointments count
    const appointmentsCount = await Appointment.countDocuments({ user: id });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        appointmentsCount,
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'vet', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: user, vet, admin',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from changing their own role (safety measure)
    if (user._id.toString() === req.userDoc._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: user.toObject ? user.toObject() : user,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

// Toggle user active status (soft delete/restore)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.userDoc._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot deactivate your own account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toObject ? user.toObject() : user,
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
      error: error.message,
    });
  }
};

// Delete user permanently (use with caution)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.userDoc._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    // Delete associated data
    await Promise.all([
      Pet.deleteMany({ owner: id }),
      Appointment.deleteMany({ user: id }),
    ]);

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted permanently',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

// Ban/Unban user
exports.toggleUserBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from banning themselves
    if (user._id.toString() === req.userDoc._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot ban your own account',
      });
    }

    user.isBanned = banned;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`,
      user: user.toObject ? user.toObject() : user,
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user ban status',
      error: error.message,
    });
  }
};

// Get all appointments (admin overview)
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, vetId, userId, upcoming, past, sort = '-dateTime' } = req.query;

    const query = {};

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (vetId) {
      query.vet = vetId;
    }

    if (userId) {
      query.user = userId;
    }

    if (upcoming === 'true') {
      query.dateTime = { $gte: new Date() };
    }

    if (past === 'true') {
      query.dateTime = { $lt: new Date() };
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'fullName email phoneNumber')
      .populate('vet', 'name clinicName phoneNumber')
      .populate('pet', 'name species breed')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

// Get all vets (admin management view)
exports.getAllVetsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, isVerified, isActive, search, sort = '-createdAt' } = req.query;

    const query = {};

    // Apply filters
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { clinicName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const vets = await Vet.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Vet.countDocuments(query);

    // Get appointment counts for each vet
    const vetsWithStats = await Promise.all(
      vets.map(async (vet) => {
        const appointmentCount = await Appointment.countDocuments({ vet: vet._id });
        return {
          ...vet.toObject(),
          appointmentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: vetsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalVets: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get all vets admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vets',
      error: error.message,
    });
  }
};

// Toggle vet verification status
exports.toggleVetVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const vet = await Vet.findById(id);

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet not found',
      });
    }

    vet.isVerified = !vet.isVerified;
    await vet.save();

    res.status(200).json({
      success: true,
      message: `Vet ${vet.isVerified ? 'verified' : 'unverified'} successfully`,
      data: vet,
    });
  } catch (error) {
    console.error('Toggle vet verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle vet verification',
      error: error.message,
    });
  }
};

// Get recent activity logs
exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent users
    const recentUsers = await User.find({ isActive: true })
      .sort('-createdAt')
      .limit(10)
      .select('fullName email role createdAt');

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'fullName')
      .populate('vet', 'name clinicName')
      .select('user vet dateTime status createdAt');

    // Get recent articles
    const recentArticles = await Article.find({ isPublished: true })
      .sort('-publishedAt')
      .limit(10)
      .populate('author', 'fullName')
      .select('title author publishedAt category');

    // Combine and sort by date
    const activities = [
      ...recentUsers.map((u) => ({
        type: 'user_registration',
        data: u,
        timestamp: u.createdAt,
      })),
      ...recentAppointments.map((a) => ({
        type: 'appointment_created',
        data: a,
        timestamp: a.createdAt,
      })),
      ...recentArticles.map((a) => ({
        type: 'article_published',
        data: a,
        timestamp: a.publishedAt,
      })),
    ]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message,
    });
  }
};

/**
 * Pet Management
 */

// Get all pets with pagination and filters
exports.getAllPets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      species,
      owner,
      search,
      isActive = 'true'
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};

    if (species && species !== 'all') {
      filter.species = species;
    }

    if (owner) {
      filter.owner = owner;
    }

    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } }
      ];
    }

    // Get pets with pagination
    const pets = await Pet.find(filter)
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count
    const total = await Pet.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      pets,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPets: total,
        hasMore: pageNum < totalPages
      }
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

// Get single pet details
exports.getPetById = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id)
      .populate('owner', 'fullName email phoneNumber')
      .lean();

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      pet,
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

// Create new pet (admin)
exports.createPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      ageUnit = 'years',
      dateOfBirth,
      weight,
      weightUnit = 'kg',
      gender = 'Unknown',
      color,
      microchipId,
      owner,
      allergies = [],
      medications = [],
      specialNeeds,
      photoUrl
    } = req.body;

    // Validate required fields
    if (!name || !species || !breed || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Name, species, breed, and owner are required',
      });
    }

    // Check if owner exists
    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found',
      });
    }

    // Check if microchip ID is unique (if provided)
    if (microchipId) {
      const existingPet = await Pet.findOne({ microchipId });
      if (existingPet) {
        return res.status(400).json({
          success: false,
          message: 'Microchip ID already exists',
        });
      }
    }

    // Create new pet
    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      ageUnit,
      dateOfBirth,
      weight,
      weightUnit,
      gender,
      color,
      microchipId,
      owner,
      allergies,
      medications,
      specialNeeds,
      photoUrl,
      isActive: true
    });

    await newPet.save();

    // Populate owner info for response
    await newPet.populate('owner', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      pet: newPet,
    });
  } catch (error) {
    console.error('Create pet error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Microchip ID already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create pet',
      error: error.message,
    });
  }
};

// Update pet
exports.updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Check if microchip ID is being changed and if it's unique
    if (updateData.microchipId) {
      const existingPet = await Pet.findOne({
        microchipId: updateData.microchipId,
        _id: { $ne: id }
      });
      if (existingPet) {
        return res.status(400).json({
          success: false,
          message: 'Microchip ID already exists',
        });
      }
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'fullName email');

    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      pet: updatedPet,
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pet',
      error: error.message,
    });
  }
};

// Delete pet
exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPet = await Pet.findByIdAndDelete(id);

    if (!deletedPet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
      pet: deletedPet,
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

// Toggle pet active status
exports.togglePetStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    pet.isActive = !pet.isActive;
    await pet.save();

    res.status(200).json({
      success: true,
      message: `Pet ${pet.isActive ? 'activated' : 'deactivated'} successfully`,
      pet,
    });
  } catch (error) {
    console.error('Toggle pet status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pet status',
      error: error.message,
    });
  }
};
