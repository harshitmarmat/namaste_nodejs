const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.ObjectId],
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);


const conversationModel = mongoose.model(
    "Converstation", conversationSchema
)

module.exports = conversationModel;