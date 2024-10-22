const validator = require("validator");
const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateProfileUpdate } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Cannot get your profile:" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const isPasswordValid = await loggedInUser.passwordValidator(
      currentPassword
    );
    if (!isPasswordValid) throw new Error("Current password is incorrect");
    if (!validator.isStrongPassword(newPassword))
      throw new Error("New password should be strong.");
    if (newPassword !== confirmNewPassword)
      throw new Error("New password and confirm new password is different");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.send(`${loggedInUser.firstName}, your password updated successfully.`);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch('/profile/edit',userAuth, async(req,res)=>{
    try {
        validateProfileUpdate(req.body);
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key)=> loggedInUser[key]=req.body[key])
        await loggedInUser.save();
        res.json({
            "message": `${loggedInUser.firstName}, your data is updated.`,
            "data" : loggedInUser
        })
    } catch(err){
        res.status(400).send("Error: "+ err.message)
    }
})



module.exports = profileRouter;
