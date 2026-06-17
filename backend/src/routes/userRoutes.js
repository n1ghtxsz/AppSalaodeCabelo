const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/me/profile', requireAuth, profileController.getProfile);
router.patch('/me/profile', requireAuth, profileController.patchProfile);
router.post('/me/password', requireAuth, profileController.changePassword);
router.delete('/me', requireAuth, profileController.deleteAccount);
router.get('/me/export', requireAuth, profileController.exportData);

module.exports = router;