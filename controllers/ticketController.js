const Ticket = require('../models/Ticket');
const { sendStatusNotification } = require('../utils/emailService');

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Private (User)
 */
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const ticketData = {
      user: req.user._id,
      title: title.trim(),
      description: description.trim()
    };

    if (category) {
      const allowedCategories = ['Hardware', 'Software', 'Network', 'Account', 'Other'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: `Category must be one of: ${allowedCategories.join(', ')}` });
      }
      ticketData.category = category;
    }

    if (priority) {
      const allowedPriorities = ['low', 'medium', 'high'];
      if (!allowedPriorities.includes(priority.toLowerCase())) {
        return res.status(400).json({ message: 'Priority must be low, medium, or high' });
      }
      ticketData.priority = priority.toLowerCase();
    }

    const ticket = await Ticket.create(ticketData);
    const populatedTicket = await Ticket.findById(ticket._id).populate('user', 'name email role profilePic');

    res.status(201).json(populatedTicket);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tickets for logged-in user with search & status filter
 * @route   GET /api/tickets/mine
 * @access  Private (User)
 */
const getMyTickets = async (req, res, next) => {
  try {
    const { search, status, priority, category } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
      // If search query looks like a Mongo ObjectId or hex substring
      if (search.trim().match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search.trim() });
      }
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email role profilePic');

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tickets (Admin only) with search and filters
 * @route   GET /api/tickets
 * @access  Private (Admin)
 */
const getAllTickets = async (req, res, next) => {
  try {
    const { search, status, priority, category } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
      if (search.trim().match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search.trim() });
      }
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email role profilePic');

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Private (Owner or Admin)
 */
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email role profilePic');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check ownership if user is not admin
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access forbidden: You can only view your own tickets' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update ticket status
 * @route   PUT /api/tickets/:id/status
 * @access  Private (Admin only)
 */
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email role profilePic');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const oldStatus = ticket.status;
    ticket.status = status;
    await ticket.save();

    // Trigger bonus email notification (Task 14)
    if (ticket.user && ticket.user.email) {
      sendStatusNotification({
        to: ticket.user.email,
        userName: ticket.user.name,
        ticketTitle: ticket.title,
        ticketId: ticket._id,
        oldStatus,
        newStatus: status
      }).catch(err => console.error('Notification error:', err.message));
    }

    res.status(200).json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a ticket
 * @route   DELETE /api/tickets/:id
 * @access  Private (Admin only)
 */
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.deleteOne();

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket
};
