require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secretMsg = process.env.SECRET_MSG;

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedMsg = jwt.verify(token, secretMsg);
    const { _id } = decodedMsg;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
