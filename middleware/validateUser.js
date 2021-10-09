const { validationResult, check } = require("express-validator");

exports.registerValidate = () => [
  check("username", "username is required").notEmpty(),
  check("email", "should be email").isEmail(),
  check("password", "password is required").notEmpty(),
  check("password", "enter a valid password").isLength({ min: 6 }),
  check("firstname", "fisrtname is required").notEmpty(),
  check("lastname", "lastname is required").notEmpty(),
  check("address", "address is required").notEmpty(),
];
exports.mailValidate = () => [
  check("email", "should be email").isEmail()
];
exports.loginValidate = () => [
  check("email", "should be email").isEmail(),
  check("password", "enter a valid password").isLength({ min: 6 }),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
