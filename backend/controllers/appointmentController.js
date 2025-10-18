const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Vet = require('../models/Vet');
const Notification = require('../models/Notification');

/**
 * Get all appointments for authenticated user
 */
const getUserAppointments = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { status, upcoming, past } = req.query;

    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log(`[GET_APPOINTMENTS] User ${user._id}, upcoming=${upcoming}, past=${past}, status=${status}`);

    const options = {};
    if (status) options.status = status;
    if (upcoming === 'true') options.upcoming = true;
    if (past === 'true') options.past = true;

    const appointments = await Appointment.findByUser(user._id, options);

    console.log(`[GET_APPOINTMENTS] Found ${appointments.length} appointments for user ${user._id}`);

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments: appointments.map((apt) => apt.toSafeObject()),
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

/**
 * Get a single appointment by ID
 */
const getAppointmentById = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;

    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const appointment = await Appointment.findById(id)
      .populate('vet', 'name clinicName phoneNumber email location')
      .populate('pet', 'name species breed age photoUrl');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify ownership or allow admin
    if (appointment.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this appointment',
      });
    }

    res.status(200).json({
      success: true,
      appointment: {
        ...appointment.toSafeObject(),
        vetNotes: appointment.vetNotes,
        diagnosis: appointment.diagnosis,
        prescription: appointment.prescription,
      },
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message,
    });
  }
};

/**
 * Book a new appointment
 */
const bookAppointment = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { vetId, petId, dateTime, duration, reason, symptoms, notes } = req.body;

    // Validate required fields
    if (!vetId || !petId || !dateTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Vet ID, Pet ID, date/time, and reason are required',
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

    // Verify pet ownership
    const pet = await Pet.findOne({ _id: petId, owner: user._id, isActive: true });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or you do not have permission',
      });
    }

    // Verify vet exists and is active
    const vet = await Vet.findOne({ _id: vetId, isActive: true, isVerified: true });

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found or not available',
      });
    }

    // Validate appointment time is in the future
    const appointmentDate = new Date(dateTime);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment time must be in the future',
      });
    }

    // Check for time conflicts
    const appointmentDuration = duration || 30;
    const hasConflict = await Appointment.hasConflict(vetId, appointmentDate, appointmentDuration);

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.',
      });
    }

    // Create appointment
    const appointment = new Appointment({
      user: user._id,
      vet: vetId,
      pet: petId,
      dateTime: appointmentDate,
      duration: appointmentDuration,
      reason,
      symptoms,
      notes,
      fee: vet.consultationFee,
    });

    await appointment.save();

    // Populate references for response
    await appointment.populate('vet', 'name clinicName phoneNumber email');
    await appointment.populate('pet', 'name species breed');

    // Create notification for the appointment
    try {
      await Notification.createAppointmentReminder(appointment, 24); // Reminder 24 hours before
    } catch (notifError) {
      console.error('Failed to create appointment notification:', notifError);
      // Don't fail the appointment creation if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: appointment.toSafeObject(),
    });
  } catch (error) {
    console.error('Book appointment error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message,
    });
  }
};

/**
 * Update an appointment
 */
const updateAppointment = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const { dateTime, duration, reason, symptoms, notes } = req.body;

    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify ownership or admin role
    if (appointment.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this appointment',
      });
    }

    // Check if appointment can be updated
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${appointment.status} appointment`,
      });
    }

    // Update fields
    if (dateTime) {
      const newDateTime = new Date(dateTime);
      if (newDateTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Appointment time must be in the future',
        });
      }

      // Check for conflicts with new time
      const newDuration = duration || appointment.duration;
      const hasConflict = await Appointment.hasConflict(
        appointment.vet,
        newDateTime,
        newDuration,
        appointment._id
      );

      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message: 'This time slot is already booked. Please choose another time.',
        });
      }

      appointment.dateTime = newDateTime;
    }

    if (duration) appointment.duration = duration;
    if (reason) appointment.reason = reason;
    if (symptoms !== undefined) appointment.symptoms = symptoms;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: appointment.toSafeObject(),
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message,
    });
  }
};

/**
 * Cancel an appointment
 */
const cancelAppointment = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify ownership or admin role
    if (appointment.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this appointment',
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled (already completed, cancelled, or too close to appointment time)',
      });
    }

    await appointment.cancel('user', reason || 'Cancelled by user');

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message,
    });
  }
};

/**
 * Get available time slots for a vet on a specific date
 */
const getAvailableSlots = async (req, res) => {
  try {
    const { vetId, date } = req.query;

    if (!vetId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vet ID and date are required',
      });
    }

    const vet = await Vet.findOne({ _id: vetId, isActive: true, isVerified: true });

    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found',
      });
    }

    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Get vet's availability for the day
    const dayAvailability = vet.availability.find(
      (slot) => slot.day === dayName && slot.isAvailable
    );

    if (!dayAvailability) {
      return res.status(200).json({
        success: true,
        availableSlots: [],
        message: 'Veterinarian is not available on this day',
      });
    }

    // Get all appointments for the vet on this date
    const appointments = await Appointment.findByVet(vetId, {
      date: requestedDate,
      status: ['pending', 'confirmed'],
    });

    // Generate time slots (30-minute intervals)
    const slots = [];
    const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);

    let currentTime = new Date(requestedDate);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(requestedDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
      const slotTime = new Date(currentTime);
      const slotEndTime = new Date(currentTime.getTime() + 30 * 60000);

      // Check if slot conflicts with existing appointments
      const isBooked = appointments.some((apt) => {
        const aptStart = new Date(apt.dateTime);
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        return (
          (slotTime >= aptStart && slotTime < aptEnd) ||
          (slotEndTime > aptStart && slotEndTime <= aptEnd) ||
          (slotTime <= aptStart && slotEndTime >= aptEnd)
        );
      });

      // Only include future slots
      const isPast = slotTime <= new Date();

      if (!isBooked && !isPast) {
        slots.push({
          startTime: slotTime.toISOString(),
          endTime: slotEndTime.toISOString(),
          available: true,
        });
      }

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.status(200).json({
      success: true,
      date: requestedDate,
      dayOfWeek: dayName,
      availableSlots: slots,
      count: slots.length,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message,
    });
  }
};

module.exports = {
  getUserAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots,
};
