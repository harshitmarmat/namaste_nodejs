const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");

const passAllowField = "firstName lastName age skills photo about gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", passAllowField);
    res.send({
      message: "These profiles interested in you.",
      data: connectRequest,
    });
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});

userRouter.get("/user/requests/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", passAllowField)
      .populate("toUserId", passAllowField);

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return { userData: request.toUserId , conversationThread: request.conversationThread };
      }
      return { userData: request.fromUserId  , conversationThread: request.conversationThread};
    });
    res.json(data);
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", "firstName _id")
      .populate("toUserId", "firstName _id");

    // const ignoredIds = connectRequest.map((request) => {
    //   if (request.fromUserId._id.equals(loggedInUser._id)) {
    //     return request.toUserId._id;
    //   }
    //   return request.fromUserId._id;
    // });
    // ignoredId.push(loggedInUser._id);
    // const feed = await User.find({
    //   _id: {
    //     $nin: ignoredId,
    //   },
    // }).select(passAllowField);

    const ignoredIds = new Set();
    ignoredIds.add(loggedInUser._id);
    connectRequest.forEach((request) => {
      ignoredIds.add(request.fromUserId._id.toString());
      ignoredIds.add(request.toUserId._id.toString());
    });

    const feedData = await User.find({
      _id: { $nin: Array.from(ignoredIds) },
    })
      .select(passAllowField)
      .skip(skip)
      .limit(limit);


    res.json(feedData);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
