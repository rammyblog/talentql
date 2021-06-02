require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const connectDb = require('./config/db');
const userRoutes = require('./routes/user.routes');

const app = express();
connectDb();

app.use(logger('tiny'));

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
