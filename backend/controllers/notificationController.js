const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Get all notifications for the authenticated user
 */
const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { page = 1, limit = 20, type = null, unreadOnly = false } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      unreadOnly: unreadOnly === 'true',
    };

    const notifications = await Notification.getUserNotifications(user._id, options);
    const unreadCount = await Notification.getUnreadCount(user._id);

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: options.page,
        limit: options.limit,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (req, res) => {
  try {
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const count = await Notification.getUnreadCount(user._id);

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message,
    });
  }
};

/**
 * Mark a notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Verify notification belongs to user
    if (notification.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const result = await Notification.markAllAsRead(user._id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message,
    });
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Verify notification belongs to user
    if (notification.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

/**
 * Create a test notification (for development/testing)
 */
const createTestNotification = async (req, res) => {
  try {
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { title, message, type = 'general', priority = 'medium' } = req.body;

    const notification = await Notification.createNotification({
      user: user._id,
      type,
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      priority,
      icon: 'info',
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Create test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createTestNotification,
};
