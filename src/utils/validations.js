const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("EmailId is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "skills"]
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
  return isEditAllowed;
};

module.exports = {
  validateSignup,
  validateProfileEditData
};
