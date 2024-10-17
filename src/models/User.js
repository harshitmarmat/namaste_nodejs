const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50
    },
    lastName : {
        type : String,
    },
    email : {
        type : String,
        required: true,
        unique: true ,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required: true,
    },
    age : {
        type : Number,
        min: 18
    },
    skilss : {
        type : [String]
    },
    photo : {
        type : String,
    },
    about : {
        type : String,
        default : "Hey, I am a developer."
    },
    gender : {
        type : String,
        lowercase : true,
        validate(val){
            if(!['male','female','other'].includes(val.toLowerCase())){
                throw new error('Gender is Invalid')
            }
        },
    }
},
{
    timestamps : true
})

const User = mongoose.model("User",userSchema);

module.exports = User