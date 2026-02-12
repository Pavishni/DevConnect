const express = require('express');
const authrouter = express.Router();
const { validateSignup } = require("../utils/validateSignup");
const User = require("../models/user");
const bcrypt = require("bcrypt");


//signUp API
authrouter.post("/signUp", async (req, res) => {
  validateSignup(req);
  const { firstName, lastName, emailId, password, skills, about } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
    about,
    skills,
  });
  try {
    await user.save();
    res.send("Data successfully inserted");
  } catch (err) {
    res.status(400).send("Error saving" + err.message);
  }
});

//login API
authrouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email ID is not available");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authrouter;