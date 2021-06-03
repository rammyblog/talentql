const { Schema, model } = require('mongoose');

const PostImageSchema = new Schema({
  // _postId: {
  //   type: Schema.Types.ObjectId,
  //   required: false,
  //   ref: 'Post',
  // },
  imageUrl: {
    type: String,
    required: true,
  },
});

const PostImage = model('PostImage', PostImageSchema);

module.exports = PostImage;
