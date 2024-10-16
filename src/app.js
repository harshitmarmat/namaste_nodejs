const express = require("express");
const { AdminAuth, UserAuth } = require("./middlewares/auth");
const { connectDb } = require("./config/database");
const User = require("./models/User");
const app = express();

app.use(express.json());

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
    res.status(400).send("Something went wrong:"+ err);
  }
});

// get all user data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong :"+err);
  }
});

// creating user
app.post("/signup", async (req, res) => {
  console.log(req.body);
  
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    console.error("Error in creating User: ", err);
    res.status(400).send("Error in creating User: "+ err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully.");
  } catch (err) {
    res.status(400).send("Something went Wrong"+ err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId
    const ALLOWED_UPDATE = ["skills","photo","about","gender","age"];

    const isUpdateAllow = Object.keys(req.body).every((k)=> ALLOWED_UPDATE.includes(k));
    if(!isUpdateAllow){
      throw new Error("Invalid field passed")
    }
    if(req.body?.skills?.length>10){
      throw new Error("Cannot add more than 10 skills")
    }
    if(req.body?.about?.length>200){
      throw new Error("About cannot be more than 200 characters")
    }

    await User.findByIdAndUpdate(userId, req.body, {
      // strict: true,
      runValidators : true
    });
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("Update failed :"+ err.message);
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
    console.log("Error in connecting with database"+ err);
  });
