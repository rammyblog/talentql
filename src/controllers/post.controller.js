const Post = require('../models/Post');

const createPostController = async (req, res) => {
  try {
    const { post, imageIds } = req.body;
    if (!post) {
      return res.status(400).json({ error: 'Post is required' });
    }
  } catch (error) {}
  return res.status(200).json({ success: true });
};

module.exports = { createPostController };
