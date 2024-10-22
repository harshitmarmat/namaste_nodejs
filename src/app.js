const express = require("express");
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)

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
