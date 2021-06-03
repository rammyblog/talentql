const fs = require('fs');
const PostImage = require('../models/PostImage');
const uploadToCloud = require('../utils/cloudinary');

const uploadPostImagesController = async (req, res) => {
  try {
    const urls = [];
    if (req.files) {
      for (const file of req.files) {
        const { path } = file;
        urls.push(uploadToCloud(path));
        // const newPath = await uploadToCloud(file);
        fs.unlinkSync(path);
      }
      const imageUrls = await Promise.all(urls);
      const data = [];
      for (const imageUrl of imageUrls) {
        const postImages = new PostImage({ imageUrl });
        data.push(postImages.save());
      }

      return res.status(200).json({
        success: true,
        message: 'All files successfully uploaded',
        data: await Promise.all(data),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { uploadPostImagesController };
