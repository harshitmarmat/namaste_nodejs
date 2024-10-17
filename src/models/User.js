const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50
    },
    lastName : {
        type : String,
        minLength : 4,
        maxLength : 50
    },
    email : {
        type : String,
        required: true,
        unique: true ,
        trim : true,
        lowercase : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Enter a valid email.")
            }
        }
    },
    password : {
        type : String,
        required: true,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Your password is not strong")
            }
        }
    },
    age : {
        type : Number,
        min: 18
    },
    skills : {
        type : [String]
    },
    photo : {
        type : String,
        validate(val){
            if(!validator.isURL(val)){
                throw new Error("Enter a valid image url.")
            }
        }
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