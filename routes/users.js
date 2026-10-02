const express = require('express');
const router = express.Router();
const { getMe, updateMe, uploadAvatar: uploadAvatarController } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const uploadAvatar = require('../utils/upload');

// Protected profile routes
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);
router.post('/me/avatar', uploadAvatar.single('avatar'), uploadAvatarController);

module.exports = router;
