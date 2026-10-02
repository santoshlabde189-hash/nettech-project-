const Ticket = require('../models/Ticket');
const User = require('../models/User');

/**
 * @desc    Get dashboard statistics for admin
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const totalUsers = await User.countDocuments();

    // Group counts by status
    const statusCountsRaw = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    statusCountsRaw.forEach(item => {
      if (item._id in statusCounts) {
        statusCounts[item._id] = item.count;
      }
    });

    // Group counts by priority
    const priorityCountsRaw = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0
    };

    priorityCountsRaw.forEach(item => {
      if (item._id in priorityCounts) {
        priorityCounts[item._id] = item.count;
      }
    });

    // Group counts by category
    const categoryCountsRaw = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryCounts = {};
    categoryCountsRaw.forEach(item => {
      categoryCounts[item._id || 'Other'] = item.count;
    });

    // Latest 5 tickets
    const latestTickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email role profilePic');

    res.status(200).json({
      totalTickets,
      totalUsers,
      statusCounts,
      priorityCounts,
      categoryCounts,
      latestTickets
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
