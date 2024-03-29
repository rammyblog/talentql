const Joi = require('@hapi/joi');

// Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// token verification validation
const tokenValidation = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
  });

  return schema.validate(data);
};

// token resend validation
const ensureEmailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
  });

  return schema.validate(data);
};

// password reset validation
const passwordResetValidation = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Password change validator
const passwordChangeValidation = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const newPostValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(5000).required(),
    imageIds: Joi.array().min(1).unique().items(Joi.string().min(1)),
  });

  return schema.validate(data);
};

const editPostValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(5000),
    imageIds: Joi.array().min(1).unique().items(Joi.string().min(1)),
  });

  return schema.validate(data);
};

module.exports = {
  loginValidation,
  registerValidation,
  tokenValidation,
  ensureEmailValidation,
  passwordResetValidation,
  passwordChangeValidation,
  newPostValidation,
  editPostValidation,
};
