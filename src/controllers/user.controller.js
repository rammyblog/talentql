const User = require('../models/User');
const { registerValidation, loginValidation } = require('../utils/validation');
const { getUser } = require('../services/user.services');

const validationObject = {
  register: registerValidation,
  login: loginValidation,
};

const handleValidation = (body, type) => {
  console.log(validationObject[type](body));
  const { error } = validationObject[type](body);
  if (error) {
    console.log('error');
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

module.exports = {
  registerController,
  loginController,
};
