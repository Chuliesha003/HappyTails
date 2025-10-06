const mongoose = require('mongoose');

/**
 * Notification Schema
 * 
 * Purpose: User notifications and alerts system
 * 
 * Data Flow:
 * 1. System/Admin creates notification
 * 2. Stored in database with user reference
 * 3. Frontend polls/fetches notifications
 * 4. User marks as read
 * 5. Used for: appointment reminders, vaccination alerts, system messages
 */

const notificationSchema = new mongoose.Schema(
  {
    // User who receives this notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    
    // Notification type
    type: {
      type: String,
      enum: ['appointment', 'vaccination', 'medication', 'symptom', 'review', 'general', 'system'],
      required: [true, 'Notification type is required'],
      index: true,
    },
    
    // Notification title
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    
    // Notification message
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    
    // Link to related page (optional)
    link: {
      type: String,
      trim: true,
    },
    
    // Action button text (optional)
    actionText: {
      type: String,
      trim: true,
      maxlength: [50, 'Action text cannot exceed 50 characters'],
    },
    
    // Priority level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    
    // Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    // When notification was read
    readAt: {
      type: Date,
    },
    
    // Related entity (for context)
    relatedEntity: {
      model: {
        type: String,
        enum: ['Appointment', 'Pet', 'Vet', 'SymptomCheck', 'Prescription'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    
    // Icon to display (frontend can use this)
    icon: {
      type: String,
      enum: ['calendar', 'syringe', 'pill', 'heart', 'alert', 'info', 'check'],
      default: 'info',
    },
    
    // Auto-expire notification after certain time
    expiresAt: {
      type: Date,
      index: true,
    },
    
    // Sent via email
    emailSent: {
      type: Boolean,
      default: false,
    },
    
    // Sent via push notification
    pushSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return await this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  const notification = new this(data);
  await notification.save();
  
  // TODO: Implement email/push notification here if needed
  // if (data.sendEmail) await sendEmail(notification);
  // if (data.sendPush) await sendPush(notification);
  
  return notification;
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to get user's notifications
notificationSchema.statics.getUserNotifications = function (userId, options = {}) {
  const { limit = 20, skip = 0, unreadOnly = false } = options;
  
  const query = { user: userId };
  if (unreadOnly) query.isRead = false;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

// Static method to create appointment reminder
notificationSchema.statics.createAppointmentReminder = async function (appointment, hoursBefore = 24) {
  const appointmentDate = new Date(appointment.dateTime);
  const reminderTime = new Date(appointmentDate.getTime() - hoursBefore * 60 * 60 * 1000);
  
  // Only create if appointment is in the future
  if (reminderTime > new Date()) {
    return await this.createNotification({
      user: appointment.user,
      type: 'appointment',
      title: 'Upcoming Appointment Reminder',
      message: `You have an appointment tomorrow at ${appointmentDate.toLocaleTimeString()}`,
      link: `/user-dashboard#appointments`,
      actionText: 'View Details',
      priority: 'high',
      icon: 'calendar',
      relatedEntity: {
        model: 'Appointment',
        id: appointment._id,
      },
      expiresAt: appointmentDate, // Expire after appointment time
    });
  }
};

// Static method to create vaccination reminder
notificationSchema.statics.createVaccinationReminder = async function (vaccination, pet) {
  const dueDate = new Date(vaccination.nextDueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue > 0 && daysUntilDue <= 30) {
    return await this.createNotification({
      user: pet.owner,
      type: 'vaccination',
      title: 'Vaccination Due Soon',
      message: `${pet.name}'s ${vaccination.vaccineName} vaccination is due in ${daysUntilDue} days`,
      link: `/pet-records`,
      actionText: 'Book Appointment',
      priority: daysUntilDue <= 7 ? 'high' : 'medium',
      icon: 'syringe',
      relatedEntity: {
        model: 'Pet',
        id: pet._id,
      },
    });
  }
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
