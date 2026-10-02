const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All ticket routes require authentication
router.use(protect);

// User routes
router.post('/', authorize('user', 'admin'), createTicket);
router.get('/mine', authorize('user', 'admin'), getMyTickets);

// Admin routes
router.get('/', authorize('admin'), getAllTickets);
router.put('/:id/status', authorize('admin'), updateTicketStatus);
router.delete('/:id', authorize('admin'), deleteTicket);

// Shared route (owner or admin)
router.get('/:id', getTicketById);

module.exports = router;
