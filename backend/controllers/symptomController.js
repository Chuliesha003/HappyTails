const { analyzeSymptoms, getPetHealthAdvice, assessEmergency } = require('../utils/geminiService');
const User = require('../models/User');
const SymptomCheck = require('../models/SymptomCheck');
const Pet = require('../models/Pet');

/**
 * Analyze pet symptoms using AI
 */
const checkSymptoms = async (req, res) => {
  try {
  const { petType, symptoms, duration, severity, additionalInfo, petId, imageUrl } = req.body;
    // Allow frontend to omit guestSession; generate one for anonymous users so the model validation passes
    let guestSession = req.body.guestSession;
    if (!req.user && !guestSession) {
      // lightweight guest session id
      guestSession = `guest_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    }

    // Validate required fields
    if (!petType || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Pet type and symptoms are required',
      });
    }

    let user = null;
    
    // Check guest usage limits for authenticated users
    if (req.user) {
      user = await User.findByFirebaseUid(req.user.uid);

      if (user) {
        // Check if user has reached limit
        if (user.hasReachedGuestLimit()) {
          return res.status(429).json({
            success: false,
            message: 'You have reached your usage limit. Please upgrade your account or contact support.',
            usageCount: user.guestUsageCount,
            limit: 3,
          });
        }

        // Increment usage count
        await user.incrementGuestUsage();
      }
    }

    // Prepare image if uploaded via multipart
    let imageBase64 = null;
    let imageMimeType = null;
    if (req.file && req.file.buffer) {
      imageBase64 = req.file.buffer.toString('base64');
      imageMimeType = req.file.mimetype || 'image/jpeg';
    }

    // Analyze symptoms using Gemini AI (with optional image)
    const analysis = await analyzeSymptoms({
      petType,
      symptoms,
      duration,
      severity,
      additionalInfo,
      imageBase64,
      imageMimeType,
    });

    // Save symptom check to database (initial basic structure)
    const symptomCheckData = {
      symptoms,
      aiResponse: {
        possibleConditions: [],
        urgencyLevel: 'medium',
        recommendations: [],
        disclaimer: analysis.disclaimer || 'This is not a substitute for professional veterinary advice.',
        rawAI: analysis.rawParsed || null,
      },
      followUpAction: (analysis.urgencyLevel === 'emergency' || analysis.rawParsed?.urgencyLevel === 'emergency') ? 'emergency' : 
                       (analysis.urgencyLevel === 'high' || analysis.rawParsed?.urgencyLevel === 'high') ? 'schedule' : 'monitor',
      imageUrl: imageUrl || null,
    };

    // Add user and pet references if available
    if (user) {
      symptomCheckData.user = user._id;
    }
    if (petId) {
      // Verify pet exists and belongs to user
      const pet = await Pet.findById(petId);
      if (pet && (!user || pet.owner.toString() === user._id.toString())) {
        symptomCheckData.pet = petId;
      }
    }
    if (guestSession) {
      symptomCheckData.guestSession = guestSession;
    }
    
    // Store IP address for analytics
    symptomCheckData.ipAddress = req.ip || req.connection.remoteAddress;

    // Save to database
    const symptomCheck = new SymptomCheck(symptomCheckData);
    await symptomCheck.save();

    // Use AI-provided structured fields and perform minimal normalization
    const aiConditions = Array.isArray(analysis.conditions) ? analysis.conditions : Array.isArray(analysis.rawParsed?.conditions) ? analysis.rawParsed.conditions : [];
    const overallUrgency = analysis.urgencyLevel || analysis.rawParsed?.urgencyLevel || 'medium';

    // Normalize using shared util
    const { normalizeConditions, mapUrgencyToEnum } = require('../utils/aiNormalization');
    const normalizedConditions = normalizeConditions(aiConditions, overallUrgency);

    symptomCheck.aiResponse = symptomCheck.aiResponse || {};
    symptomCheck.aiResponse.possibleConditions = normalizedConditions;
    symptomCheck.aiResponse.urgencyLevel = mapUrgencyToEnum(overallUrgency);
    symptomCheck.aiResponse.recommendations = analysis.recommendations || analysis.rawParsed?.recommendations || [];

    await symptomCheck.save();

    res.status(200).json({
      success: true,
      data: {
        conditions: aiConditions,
        overallUrgency,
        disclaimerShown: true,
      },
      analysis,
      symptomCheckId: symptomCheck._id,
      recommendations: {
        findVet: '/api/vets',
        bookAppointment: '/api/appointments',
      },
    });
  } catch (error) {
    console.error('Check symptoms error:', error);

    if (error.message.includes('API key')) {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again later.',
      });
    }

    if (error.message.includes('quota')) {
      return res.status(429).json({
        success: false,
        message: 'Service temporarily unavailable due to high demand. Please try again in a few minutes.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to analyze symptoms',
      error: error.message,
    });
  }
};

/**
 * Get pet health advice
 */
const getHealthAdvice = async (req, res) => {
  try {
    const { question, petType } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      });
    }

    // Check guest usage limits for authenticated users
    if (req.user) {
      const user = await User.findByFirebaseUid(req.user.uid);

      if (user && user.hasReachedGuestLimit()) {
        return res.status(429).json({
          success: false,
          message: 'You have reached your usage limit. Please upgrade your account.',
          usageCount: user.guestUsageCount,
          limit: 3,
        });
      }

      if (user) {
        await user.incrementGuestUsage();
      }
    }

    const advice = await getPetHealthAdvice(question, petType);

    res.status(200).json({
      success: true,
      advice,
    });
  } catch (error) {
    console.error('Get health advice error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to get health advice',
      error: error.message,
    });
  }
};

/**
 * Assess emergency situation
 */
const checkEmergency = async (req, res) => {
  try {
    const { petType, symptoms, vitalSigns } = req.body;

    if (!petType || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Pet type and symptoms are required',
      });
    }

    // Emergency checks don't count toward usage limits
    const assessment = await assessEmergency({
      petType,
      symptoms,
      vitalSigns,
    });

    res.status(200).json({
      success: true,
      assessment,
      emergencyVets: {
        message: 'Find emergency veterinary clinics near you',
        endpoint: '/api/vets?emergency=true',
      },
    });
  } catch (error) {
    console.error('Check emergency error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to assess emergency',
      error: error.message,
    });
  }
};

/**
 * Get usage statistics for current user
 */
const getUsageStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        isGuest: true,
        message: 'Sign in to track your usage and get unlimited access',
        usageCount: 0,
        limit: 3,
      });
    }

    const user = await User.findByFirebaseUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const hasReachedLimit = user.hasReachedGuestLimit();

    res.status(200).json({
      success: true,
      isGuest: false,
      usageCount: user.guestUsageCount,
      limit: 3,
      hasReachedLimit,
      remainingUses: Math.max(0, 3 - user.guestUsageCount),
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage statistics',
      error: error.message,
    });
  }
};

/**
 * Get symptom check history for current user
 */
const getSymptomCheckHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view history',
      });
    }

    const user = await User.findByFirebaseUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const limit = parseInt(req.query.limit) || 20;
    const history = await SymptomCheck.getRecentChecks(user._id, limit);

    res.status(200).json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Get symptom check history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch symptom check history',
      error: error.message,
    });
  }
};

module.exports = {
  checkSymptoms,
  getHealthAdvice,
  checkEmergency,
  getUsageStats,
  getSymptomCheckHistory,
};
