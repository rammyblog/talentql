require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const connectDb = require('./config/db');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const postImagesRoutes = require('./routes/postImages.routes');

const app = express();
connectDb();

app.use(logger('tiny'));

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts-images', postImagesRoutes);

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
