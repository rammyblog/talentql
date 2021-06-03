const router = require('express').Router();
const multer = require('multer');
const {
  uploadPostImagesController,
} = require('../controllers/postImage.controller');
const ensureAuth = require('../middlewares/ensureAuth');

let storage = multer.diskStorage({
  destination(req, file, callback) {
    // console.log('file', file);
    callback(null, './src/uploads/');
  },
  filename(req, file, callback) {
    // console.log('multer file:', file);
    callback(null, `${file.originalname}-${Date.now()}`);
  },
});
let maxSize = 1000000 * 1000;
let upload = multer({
  storage,
  limits: {
    fileSize: maxSize,
  },
});

// Uploading of post images
// @desc Uploading of post images
// @route POST /api/posts-images/
// @access Private
router.post(
  '/',
  [ensureAuth, upload.array('images', 6)],
  uploadPostImagesController
);

module.exports = router;
