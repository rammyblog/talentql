/* eslint-disable operator-linebreak */
/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function ensureAuth(req, res, next) {
  // Gather the jwt access token from the request header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Not authorized too access this route' }); // if there isn't any token
    }

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findById(verified.id);

      if (!user) {
        return res.status(400).json({ error: 'No user found with this id' });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token' });
    }
  } else {
    return res
      .status(401)
      .json({ error: 'Not authorized too access this route' });
  }
}

module.exports = ensureAuth;
