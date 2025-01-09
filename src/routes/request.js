const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const ConnectionRequestModel = require("../models/connectionRequest");
const conversationModel = require("../models/conversation");

const requestHandler = express.Router();

requestHandler.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      const allowedField = ["interested", "ignored"];
      if (!allowedField.includes(status)) {
        return res.status(400).json({
          message: "Invalid action: " + status,
        });
      }
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          message: "User not found.",
        });
      }
      const connectionExist = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionExist) {
        return res.status(400).json({
          message: "Connection already exists.",
        });
      }
      const requestConnection = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await requestConnection.save();
      res.json({
        message: `${req.user.firstName} is ${
          status === "ignored" ? "not" : ""
        } interested in ${toUser.firstName}`,
        data: requestConnection,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestHandler.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const allowedField = ["accepted", "rejected"];
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      if (!allowedField.includes(status)) {
        return res.status(400).json({
          message: "Invalid request: " + status,
        });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if(!connectionRequest){
        return res.status(400).json({
          message : "Connection not found."
        })
      }
      const conversation = new conversationModel({
        participants : [connectionRequest.toUserId,connectionRequest.fromUserId]
      })
      
      connectionRequest.conversationThread = conversation._id
      connectionRequest.status = status;
      await connectionRequest.save();
      const con = await conversation.save();
      res.json(connectionRequest);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestHandler;
