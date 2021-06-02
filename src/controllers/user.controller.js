const User = require('../models/User');
const Token = require('../models/Token');

const {
  registerValidation,
  loginValidation,
  ensureEmailValidation,
  passwordResetValidation,
} = require('../utils/validation');
const { getUser } = require('../services/user.services');
const { getToken } = require('../services/token.services');

const randomTokenGen = require('../utils/randomTokenGen');

const validationObject = {
  register: registerValidation,
  login: loginValidation,
  ensureEmail: ensureEmailValidation,
  passwordReset: passwordResetValidation,
};

const handleValidation = (body, type) => {
  const { error } = validationObject[type](body);
  if (error) {
    throw Error(error.details[0].message);
  }
};

const registerController = async (req, res) => {
  try {
    // Validate against JOI object
    await handleValidation(req.body, 'register');

    const { email } = req.body;
    const emailExist = await getUser({ email });

    if (emailExist) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    const token = savedUser.getSignedToken();
    return res.status(201).json({
      success: 'true',
      message: 'Account registered successfully',
      token,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    await handleValidation(req.body, 'login');
    const { email, password } = req.body;
    const user = await getUser({ email });
    const validPass = await user.matchPasswords(password);
    if (!validPass) {
      return res.status(400).json({ error_msg: 'Incorrect password' });
    }
    const token = user.getSignedToken();
    // send email
    return res.status(200).json({
      success: 'true',
      message: 'Login success',
      token,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const sendPasswordResetToken = async (req, res) => {
  try {
    await handleValidation(req.body, 'ensureEmail');

    const { email } = req.body;
    const user = await getUser({ email });
    const token = await Token.findOne({ _userId: user._id });
    if (token) {
      return res.status(200).json({
        success: true,
        message: 'Token generated successfully',
        data: token,
      });
    }

    // Generate and send token
    const data = await randomTokenGen(user);
    // send email to user
    return res.status(200).json({
      success: true,
      message: 'Token generated successfully',
      data,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const passwordReset = async (req, res) => {
  try {
    await handleValidation(req.body, 'passwordReset');
    const { email, token: reqToken, password } = req.body;
    const token = await getToken({ token: reqToken });

    // User confirmation
    const user = await getUser({ email });

    // Ensure new password not equals to old password
    const passwordCompare = await user.matchPasswords(password);

    if (passwordCompare) {
      return res
        .status(400)
        .json({ error: "You can't use this password again" });
    }
    await user.save();
    // Delete token if user is verified
    await token.remove();
    // Send an email to the user telling the password change successful
    return res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  sendPasswordResetToken,
  passwordReset,
};
