const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 15,
    },
    age: {
      type: Number,
      min: 18,
    },
    about: {
      type: String,
      default: "This is default about"
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
