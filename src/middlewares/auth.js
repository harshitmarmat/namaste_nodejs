const jwt = require("jsonwebtoken");
const User = require("../models/User");


const userAuth = async(req, res, next) => {
    try{
        const cookie = req.cookies;
        const {token} = cookie;
        
        if(!token) {
            return res.status(401).send("Please Login.");
        }        const decodedData = await jwt.verify(token,"DEV@tinder$");
        const {userId} = decodedData;
        const user = await User.findById({_id : userId});
        
        if(!user) throw new Error("User not found.");
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("Error: "+ err.message)
    }

}

module.exports = { userAuth}