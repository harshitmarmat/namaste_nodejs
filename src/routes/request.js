const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const ConnectionRequestModel = require("../models/connectionRequest");

const requestHandler = express.Router();

requestHandler.post("/send/request/:status/:toUserId", userAuth, async(req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;
    console.log(status,toUserId);
    
    const allowedField = ['interested','ignored'];
    if(!allowedField.includes(status)){
      return  res.status(400).json({
        message : "Invalid action: " + status
      })
    }
    console.log("here");
    const toUser = await User.findById(toUserId);
    console.log(toUser);
    
    if(!toUser){
      return res.status(404).json({
        message : "User not found."
      })
    }
    const connectionExist = await ConnectionRequestModel.findOne({
      $or : [
        {fromUserId,toUserId},
        {fromUserId : toUserId , toUserId : fromUserId}
      ]
    })
    if(connectionExist){
      return res.status(400).json({
        message : "Connection already exists."
      })
    }
    const requestConnection = new ConnectionRequestModel({
      fromUserId,toUserId,status
    })    
    await requestConnection.save();
    console.log('test2');
    res.json({
      message : `${req.user.firstName} is ${status==='ignored'?'not':''} interested in ${toUser.firstName}`,
      data : requestConnection
    })

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});





module.exports = requestHandler;
