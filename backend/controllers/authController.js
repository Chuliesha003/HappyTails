const User = require('../models/User');
const { verifyIdToken } = require('../config/firebase');

/**
 * Register a new user or login existing user
 * Firebase handles authentication, we just sync user data to our database
 */
const registerOrLogin = async (req, res) => {
  try {
    const { idToken, fullName } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify Firebase token
    const decodedToken = await verifyIdToken(idToken);
    const { uid: firebaseUid, email } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not found in Firebase token',
      });
    }

    // Check if user already exists
    let user = await User.findByFirebaseUid(firebaseUid);

    if (user) {
      // User exists - login
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: user.toSafeObject(),
        isNewUser: false,
      });
    }

    // New user - register
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required for new user registration',
      });
    }

    user = new User({
      firebaseUid,
      email,
      fullName,
      role: 'user',
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toSafeObject(),
      isNewUser: true,
    });
  } catch (error) {
    console.error('Register/Login error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration/Login failed',
      error: error.message,
    });
  }
};

/**
 * Get current authenticated user profile
 */
const getCurrentUser = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;

    const user = await User.findByFirebaseUid(firebaseUid).populate('pets');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.toSafeObject(),
      pets: user.pets,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { fullName, phoneNumber, profileImage } = req.body;

    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * Delete user account
 */
const deleteAccount = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;

    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete - mark as inactive instead of actually deleting
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message,
    });
  }
};

/**
 * Check guest usage limit for symptom checker
 */
const checkGuestLimit = async (req, res) => {
  try {
    // If user is authenticated
    if (req.user) {
      const { uid: firebaseUid } = req.user;
      const user = await User.findByFirebaseUid(firebaseUid);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const hasReachedLimit = user.hasReachedGuestLimit();

      return res.status(200).json({
        success: true,
        hasReachedLimit,
        usageCount: user.guestUsageCount,
        limit: 3,
        isAuthenticated: true,
      });
    }

    // Guest user - check from request headers or cookies
    // For now, guests have unlimited access or implement IP-based tracking
    res.status(200).json({
      success: true,
      hasReachedLimit: false,
      usageCount: 0,
      limit: 3,
      isAuthenticated: false,
      message: 'Guest users have limited access. Please sign in for unlimited usage.',
    });
  } catch (error) {
    console.error('Check guest limit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check usage limit',
      error: error.message,
    });
  }
};

module.exports = {
  registerOrLogin,
  getCurrentUser,
  updateProfile,
  deleteAccount,
  checkGuestLimit,
};
