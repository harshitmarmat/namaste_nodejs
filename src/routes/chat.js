const express = require("express");
const conversationModel = require("../models/conversation");
const MessageModel = require("../models/message");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

const sendMessage = async({
  loggedInUserID,
  conversationId,
  toUserId,content
}) => {
  try {
    // const { _id: loggedInUserID } = req.user;
    // const { conversationId } = req.params;
    // const { toUserId, content } = req.body;
    const conversationThread = await conversationModel.findById(conversationId);
    if (content.length <= 0 || content.length > 150)
      throw new Error(
        "Message is invalid. Neither it should be empty nor exceed than 150 characters."
      );
    if (toUserId.toString() === loggedInUserID.toString())
      throw new Error("You can't send message to yourself.");
    if (!conversationThread) {
      throw new Error("Conversation not found.");
    }

    const isCorrect =
      conversationThread.participants.includes(loggedInUserID) &&
      conversationThread.participants.includes(toUserId);
    if (!isCorrect) {
      throw new Error("Conversation not found.");
    }
    const message = new MessageModel({
      content,
      sender: loggedInUserID,
      conversationId,
    });
    conversationThread.updatedAt = new Date().toISOString();

    const response = await message
      .save()
      .then((savedMessage) => {
        // Populate the 'sender' field after saving
        return MessageModel.findById(savedMessage._id).populate(
          "sender",
          "firstName photo"
        );
      })
      .then((populatedMessage) => {
        return populatedMessage;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await conversationThread.save();
    return response
    // res.json({ msg: "Message sent successfully", data: response });
  } catch (err) {
    // res.status(400).send("Err : " + err.message);
    console.log("Error in storing message:", err.message);
    
  }
}

chatRouter.post("/send/message/:conversationId", userAuth, async (req, res) => {
  try {
    const { _id: loggedInUserID } = req.user;
    const { conversationId } = req.params;
    const { toUserId, content } = req.body;
    const conversationThread = await conversationModel.findById(conversationId);
    if (content.length <= 0 || content.length > 150)
      throw new Error(
        "Message is invalid. Neither it should be empty nor exceed than 150 characters."
      );
    if (toUserId.toString() === loggedInUserID.toString())
      throw new Error("You can't send message to yourself.");
    if (!conversationThread) {
      throw new Error("Conversation not found.");
    }

    const isCorrect =
      conversationThread.participants.includes(loggedInUserID) &&
      conversationThread.participants.includes(toUserId);
    if (!isCorrect) {
      throw new Error("Conversation not found.");
    }
    const message = new MessageModel({
      content,
      sender: loggedInUserID,
      conversationId,
    });
    conversationThread.updatedAt = new Date().toISOString();

    const response = await message
      .save()
      .then((savedMessage) => {
        // Populate the 'sender' field after saving
        return MessageModel.findById(savedMessage._id).populate(
          "sender",
          "firstName photo"
        );
      })
      .then((populatedMessage) => {
        return populatedMessage;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    await conversationThread.save();
    res.json({ msg: "Message sent successfully", data: response });
  } catch (err) {
    res.status(400).send("Err : " + err.message);
  }
});

chatRouter.get("/inbox", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const inbox = await conversationModel
      .find({
        participants: loggedInUser._id,
      })
      .populate({ path: "participants", select: "firstName photo" });

    if (!inbox) {
      throw new Error("Something went wrong");
    }
    if (inbox.length === 0) {
      res.json({
        message: "You have no connection right now.",
      });
    }
    res.json({ data: inbox });
  } catch (err) {
    res.status(400).send("Err : " + err.message);
  }
});

chatRouter.get("/chat/:conversationId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { conversationId } = req.params;
    const conversationThread = await conversationModel.findOne({
      $and: [
        {
          _id: conversationId,
          participants: loggedInUser,
        },
      ],
    });
    if (!conversationThread) {
      throw new Error("Sorry! you have no access for this conversation");
    }

    const chats = await MessageModel.find({
      $and: [
        { conversationId }, // Match conversationId
        {
          $or: [
            { sender: loggedInUser._id }, // Check if sender is the logged-in user
            { sender: { $in: conversationThread.participants } }, // Check if sender is in participants array
          ],
        },
      ],
    })
      .populate({ path: "sender", select: "firstName photo" })
      .select("content sender createdAt");
    res.json({ chats });
  } catch (err) {
    res.status(400).send("Err : " + err.message);
  }
});

module.exports = {chatRouter, sendMessage};
