const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    next();
    console.log("req 1");
    // res.end("Request Handler 1!!");
    }
    ,
    (req, res, next) => {
        console.log("RH 2");
        next();
    }
    ,
    (req, res, next) => {
        console.log("RH 3");
        next();
    }
);

app.listen("7777", () => {
  console.log("Listening server on port 7777...");
});
