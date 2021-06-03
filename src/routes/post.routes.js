const router = require('express').Router();

const {
  createPostController,
  getASinglePostController,
  deletePostController,
} = require('../controllers/post.controller');
const ensureAuth = require('../middlewares/ensureAuth');

// Create post route
// @desc Creating of a new post
// @route POST /api/posts/
// @access Private
router.post('/', ensureAuth, createPostController);

// Fetch a post route
// @desc Getting of a post
// @route GET /api/posts/:id
// @access Private
router.get('/:id', ensureAuth, getASinglePostController);

// Delete a post route
// @desc Deleting of a post
// @route DELETE /api/posts/:id
// @access Private
router.delete('/:id', ensureAuth, deletePostController);

module.exports = router;
