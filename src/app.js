const express = require("express");
const { auth } = require("./middlewares/auth");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignup } = require("./utils/validateSignup");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { userAuth } = require("./middlewares/auth");
const secretMsg = process.env.SECRET_MSG;

app.use(express.json());
app.use(cookieParser());

//signUp API
app.post("/signUp", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email ID is not available");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, secretMsg);
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async(req, res)=>{
  const user = req.user;
  res.send(user.firstName + " has sent the connection request");
})

connectDb()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(7777, () => {
      console.log(
        "Server running successfully in port http://localhost:7777/...."
      );
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
