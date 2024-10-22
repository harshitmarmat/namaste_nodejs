const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/User");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Password.");
    const isPasswordValid = await user.passwordValidator(password);
    if (isPasswordValid) {
      // create jwt token
      const token = await user.getJWT();
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

authRouter.post('/logout',(req,res)=>{
  res.cookie('token',null ,{
    expires : new Date()
  });
  res.send('Logout successfully');
})


module.exports = authRouter;
