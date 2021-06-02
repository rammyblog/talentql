const router = require('express').Router();

const {
  registerController,
  loginController,
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

module.exports = router;
