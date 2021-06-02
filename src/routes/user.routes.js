const router = require('express').Router();

const {
  registerController,
  loginController,
  sendPasswordResetToken,
  passwordReset,
} = require('../controllers/user.controller');

// Registration route
// @desc Register a new user to the db
// @route POST /api/users/signup
// @access Public
router.post('/signup', registerController);

// Login route
// @desc Returns a jwt for an existing user
// @route POST /api/users/login
// @access Public
router.post('/login', loginController);

// Password reset token route
// @desc Returns a password reset token for an existing user and also sends the user an email
// @route POST /api/users/send-password-reset-token
// @access Public
router.post('/send-password-reset-token', sendPasswordResetToken);

// Password reset
// @desc  For resetting password
// @route POST /api/users/password-reset
// @access Public
router.post('/password-reset', passwordReset);

module.exports = router;
