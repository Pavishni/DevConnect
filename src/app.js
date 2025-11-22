const express = require("express");
const { auth } = require("./middlewares/auth");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

//signUp API
app.post("/signUp", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Data successfully inserted");
  } catch (err) {
    res.status(400).send("Error saving" + err.message);
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
    const ALLOWED_UPDATES = ["about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not allowed")
    }
    if(data?.skills.length > 10){
      throw new Error("Skills should not be greater than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("Updated successfully");
  } catch (err) {
    res.status(400).send("Update failed: "+ err.message);
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
