const router = require('express').Router();

const { createPostController } = require('../controllers/post.controller');
const ensureAuth = require('../middlewares/ensureAuth');

// Create post route
// @desc Creating of a new post
// @route POST /api/posts/
// @access Private
router.post('/', ensureAuth, createPostController);

module.exports = router;
