const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);
router.post('/avatar/upload', protect, profileController.uploadAvatar);
router.put('/avatar/default', protect, profileController.selectDefaultAvatar);
router.put('/password', protect, profileController.changePassword);

module.exports = router;
