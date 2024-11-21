const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
    {
        content : {
            type : String,
            require : true,
        },
        sender : {
            type : mongoose.Schema.ObjectId,
            ref : "User",
            require : true
        },
        conversationId : {
            type : mongoose.Schema.ObjectId,
            ref : "conversationModel",
            require : true
        }
    },
    {
        timestamps : true
    }
)

const MessageModel =  mongoose.model(
    "Message", messageSchema
)


module.exports = MessageModel