const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestHandler = express.Router();


requestHandler.get('/sendConnectionRequest',userAuth,(req,res)=>{
    try{
      res.send(req.user.firstName+" req send")
    }catch(err){
      res.status(400).send("Cannot get your profile:" + err.message);
    }
  })


module.exports = requestHandler
