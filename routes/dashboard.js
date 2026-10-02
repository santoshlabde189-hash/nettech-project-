const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Admin only dashboard stats
router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
