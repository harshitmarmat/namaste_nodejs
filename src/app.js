const express = require("express");
const { AdminAuth, UserAuth } = require("./middlewares/auth");
const { connectDb } = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validate");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const {userAuth} = require("./utils/auth")
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
    const isPasswordValid = await user.passwordValidator(password)
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

//get profile data
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Cannot get your profile:" + err.message);
  }
});

app.get('/sendConnectionRequest',userAuth,(req,res)=>{
  try{
    res.send(req.user.firstName+" req send")
  }catch(err){
    res.status(400).send("Cannot get your profile:" + err.message);
  }
})

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
