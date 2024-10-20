const express = require("express");
const { AdminAuth, UserAuth } = require("./middlewares/auth");
const { connectDb } = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validate");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser());
// creating user
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    //validate data
    validateSignUpData(req.body);
    //encrypt pass
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send("Error in creating User: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Password.");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create jwt token
      const token = await jwt.sign({ userId: user._id }, "DEV@tinder$");
      // store it in cookie

      res.cookie("token", token);
      res.send("Successfully logged in.");
    } else {
      throw new Error("Invalid Password.");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// get user data via email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err);
  }
});

//get profile data
app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) throw new Error("Please login.");
    const data = await jwt.verify(token, "DEV@tinder$");
    if (!data) throw new Error("Please login.");
    const { userId } = data;
    if (!userId) throw new Error("User not found.");
    const user = await User.findById({ _id: userId });
    res.send(user);
  } catch (err) {
    res.status(400).send("Cannot get your profile:" + err.message);
  }
});

// get all user data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong :" + err);
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully.");
  } catch (err) {
    res.status(400).send("Something went Wrong" + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const ALLOWED_UPDATE = ["skills", "photo", "about", "gender", "age"];

    const isUpdateAllow = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );
    if (!isUpdateAllow) {
      throw new Error("Invalid field passed");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("Cannot add more than 10 skills");
    }
    if (req.body?.about?.length > 200) {
      throw new Error("About cannot be more than 200 characters");
    }

    await User.findByIdAndUpdate(userId, req.body, {
      // strict: true,
      runValidators: true,
    });
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("Update failed :" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("connection with database successfully established.");
    app.listen("7777", () => {
      console.log("Listening server on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Error in connecting with database" + err);
  });
