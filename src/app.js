const express = require("express");
const { AdminAuth, UserAuth } = require("./middlewares/auth");
const { connectDb } = require("./config/database");
const  User  = require("./models/User");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Anshul",
    lastName: "gupta",
    age: 20,
    email: "anshul@gupta.com",
  });
  try{
    await user.save();
    res.send("User created Successfully");
  }
  catch(err){
    console.error("Error in creating User", err);
    res.status(400).send("Error in creating User", err.message)
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
    console.log("Error in connecting with database", err);
  });
