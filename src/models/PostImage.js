const { Schema, model } = require('mongoose');

const PostImageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
    match: [
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
      'Please provide a valid image url',
    ],
  },
});

const PostImage = model('PostImage', PostImageSchema);

module.exports = PostImage;
