const jwt = require("jsonwebtoken");
const User = require("../models/User");


const userAuth = async(req, res, next) => {
    try{
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token) throw new Error('token not found!!!')
        const decodedData = await jwt.verify(token,"DEV@tinder$");
        const {userId} = decodedData;
        const user = await User.findById({_id : userId});
        console.log(user);
        
        if(!user) throw new Error("User not found.");
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("Error: "+ err.message)
    }

}

module.exports = { userAuth}