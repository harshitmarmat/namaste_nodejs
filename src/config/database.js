const mongoose = require("mongoose");

const connectDb = async () => {
  const res = await mongoose.connect(
    "mongodb+srv://namastedev:qlu6RLZF8URITOIQ@nodejs.cckov.mongodb.net/devTinder"
  );
};

module.exports = { connectDb };
