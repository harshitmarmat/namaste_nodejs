const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Enter a valid email.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error("Your password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    skills: {
      type: [String],
    },
    photo: {
      type: String,
      validate(val) {
        if (!validator.isURL(val)) {
          throw new Error("Enter a valid image url.");
        }
      },
      default : "https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png"
    },
    about: {
      type: String,
      default: "Hey, I am a developer.",
    },
    gender: {
      type: String,
      lowercase: true,
      validate(val) {
        if (!["male", "female", "other"].includes(val.toLowerCase())) {
          throw new error("Gender is Invalid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, "DEV@tinder$");
  return token;
};

userSchema.methods.passwordValidator = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
