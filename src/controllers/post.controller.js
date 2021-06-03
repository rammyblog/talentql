const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const {
  newPostValidation,
  editPostValidation,
} = require('../utils/validation');

const validationObject = {
  newPost: newPostValidation,
  editPost: editPostValidation,
};

const handleValidation = (body, type) => {
  const { error } = validationObject[type](body);
  if (error) {
    throw Error(error.details[0].message);
  }
};
const composePostResponse = async (post, imageIds) => {
  const images = await PostImage.find({ _id: imageIds });
  const { content, _id, user } = post;
  const responseData = { content, _id, images, user };
  return responseData;
};
const createPostController = async (req, res) => {
  try {
    const { imageIds } = req.body;

    await handleValidation(req.body, 'newPost');
    const newPost = new Post(req.body);
    newPost.user = req.user._id;
    await newPost.save();

    return res.status(200).json({
      success: true,
      message: 'Post created successfully',
      data: await composePostResponse(newPost, imageIds),
      //   results,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getASinglePostController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post with that ID not found' });
    }
    const { imageIds } = post;

    return res.status(200).json({
      success: 'true',
      message: 'Post retrieved successfully',
      data: await composePostResponse(post, imageIds),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deletePostController = async (req, res) => {
  try {
    if (String(req.user._id) !== String(post.user)) {
      return res
        .status(401)
        .json({ error: `You don't have permission to delete this post` });
    }
    await Post.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({ success: true, message: 'Deleted success' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const editPostController = async (req, res) => {
  try {
    await handleValidation(req.body, 'editPost');
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post with that ID not found' });
    }
    if (String(req.user._id) !== String(post.user)) {
      return res
        .status(401)
        .json({ error: `You don't have permission to edit this post` });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    const { imageIds } = updatedPost;
    return res.status(200).json({
      success: true,
      message: 'Edited success',
      data: await composePostResponse(updatedPost, imageIds),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPostController,
  getASinglePostController,
  deletePostController,
  editPostController,
};
