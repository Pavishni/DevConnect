const express = require("express");
const { auth } = require("./middlewares/auth");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignup } = require("./utils/validateSignup");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretMsg = process.env.SECRET_MSG

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
    skills
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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is invalid");
    } else {
      const decodedMsg = jwt.verify(token, secretMsg);
      const { _id } = decodedMsg;
      const user = await User.findById(_id);
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//find user API using email ID
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//fetch all users from collection
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Find and delete user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//Update using UserId
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["about", "gender", "age", "skills", "password"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills should not be greater than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("Updated successfully");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

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
