const crypto = require('crypto');
const Token = require('../models/Token');

module.exports = async function (user) {
  try {
    // Generate and send token
    const token = await crypto.randomBytes(20).toString('hex');
    const userToken = new Token({ _userId: user._id, token });
    await userToken.save();
    return userToken;
  } catch (error) {
    throw error;
  }
};
