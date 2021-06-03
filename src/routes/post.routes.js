const router = require('express').Router();

const {
  createPostController,
  getASinglePostController,
} = require('../controllers/post.controller');
const ensureAuth = require('../middlewares/ensureAuth');

// Create post route
// @desc Creating of a new post
// @route POST /api/posts/
// @access Private
router.post('/', ensureAuth, createPostController);

// Fetch a post route
// @desc Getting of a post
// @route POST /api/posts/:id
// @access Private
router.get('/:id', ensureAuth, getASinglePostController);

module.exports = router;
