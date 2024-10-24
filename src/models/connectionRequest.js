const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//optimizing db query
connectionRequestSchema.index({fromUserId:1,toUserId:1})

//this will executed before saving db
connectionRequestSchema.pre('save',function(next){
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error('You cannot make connection with yourself')
    }
    next()
})

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
