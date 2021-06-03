const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const { newPostValidation } = require('../utils/validation');

const validationObject = {
  newPost: newPostValidation,
};

const handleValidation = (body, type) => {
  const { error } = validationObject[type](body);
  if (error) {
    throw Error(error.details[0].message);
  }
};
const composePostResponse = async (post, imageIds) => {
  const images = await PostImage.find({ _id: imageIds });
  const { content, _id } = post;
  const responseData = { content, _id, images };
  return responseData;
};
const createPostController = async (req, res) => {
  try {
    const { imageIds } = req.body;

    await handleValidation(req.body, 'newPost');
    const newPost = new Post(req.body);
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

module.exports = { createPostController, getASinglePostController };
