/* eslint-disable camelcase */
const cloudinary = require('cloudinary').v2;

const uploadToCloud = async (image) => {
  // cloudinary configuration
  cloudinary.config({
    cloud_name: 'rammy',
    api_key: '318976855628583',
    api_secret: '9l9oRVPQAhlNMd8pRe5Bj7AX_54',
  });
  try {
    const { secure_url } = await cloudinary.uploader.upload(image);
    console.log(secure_url);
    return secure_url;
  } catch (error) {
    throw error;
  }
};

module.exports = uploadToCloud;
