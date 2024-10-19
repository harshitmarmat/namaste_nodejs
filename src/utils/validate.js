const validator = require("validator");

const validateSignUpData = (data) => {
    const {firstName, lastName , password, email} = data;
    if(!firstName || !lastName){
        throw new Error("Enter valid name.");
    }
    else if(firstName.length>50 || firstName.length<4){
        throw new Error("Name should have 4-50 characters");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is invalid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter the strong password")
    }
}

module.exports = {
    validateSignUpData
}