const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validations");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.send("Edit was saved successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// profileRouter.patch("/profile/password", userAuth, async (req, res) => {
//   try {

//   } catch (err) {
//     res.status(400).send("Error :" + err.message);
//   }
// });

module.exports = profileRouter;
