const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Enter a valid content'],
    min: 1,
    max: 5000,
  },
  imageIds: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'PostImage',
      unique: true,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Post = model('Post', PostSchema);

module.exports = Post;
