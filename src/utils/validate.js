const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, password, email } = data;

  if (!firstName || !lastName) {
    throw new Error("Enter valid name.");
  } else if (firstName.length > 50 || firstName.length < 4) {
    throw new Error("Name should have 4-50 characters.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is invalid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password.");
  }
};

const validateName = (name) => name.length > 4 && name.length < 50;
const validateSkills = (skills) => skills.length < 10;
const validateAge = (age) => age > 18;
const validatePhoto = (photo) => validator.isURL(photo);
const validateGender = (gender) => ["male", "female", "other"].includes(gender.toLowerCase());
const validateAbout = (about) => about.length > 0 && about.length < 300;

const validateProfileUpdate = (data) => {
  const updateAllowedFields = ["firstName", "lastName", "skills", "age", "photo", "gender", "about"];

  // Check if the provided keys are valid
  const isAllowed = Object.keys(data).every((key) => updateAllowedFields.includes(key));

  if (!isAllowed) {
    throw new Error("Invalid fields in update data.");
  }

  // Validate only the fields present in data
  if (data.firstName && !validateName(data.firstName)) {
    throw new Error("First name should have 4-50 characters.");
  }

  if (data.lastName && !validateName(data.lastName)) {
    throw new Error("Last name should have 4-50 characters.");
  }

  if (data.skills && !validateSkills(data.skills)) {
    throw new Error("Skills should be less than 10.");
  }

  if (data.age && !validateAge(data.age)) {
    throw new Error("Age should be above 18.");
  }

  if (data.photo && !validatePhoto(data.photo)) {
    throw new Error("Photo should be a valid URL.");
  }

  if (data.gender && !validateGender(data.gender)) {
    throw new Error("Gender should be 'male', 'female', or 'other'.");
  }

  if (data.about && !validateAbout(data.about)) {
    throw new Error("About section should have 1-300 characters.");
  }

  return true; // Validation passed if no error is thrown
};

module.exports = {
  validateSignUpData,
  validateProfileUpdate,
};
