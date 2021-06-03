/* eslint-disable camelcase */
const cloudinary = require('cloudinary').v2;

const uploadToCloud = async (image) => {
  // cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
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
